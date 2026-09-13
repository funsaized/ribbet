import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {cpus} from 'node:os';
import {loadConfig} from '../src/config/index.ts';
import {resolveInvocation} from '../src/definitions/index.ts';
import {runInvocation,routeFor} from '../src/engine/runtime/index.ts';
import {Budget} from '../src/sdk/index.ts';
if(process.env.RIBBIT_RUN_LIVE_EVAL!=='1')throw new Error('Set RIBBIT_RUN_LIVE_EVAL=1 to authorize local evaluation requests');
const config=await loadConfig();if(process.env.RIBBIT_EVAL_PROFILE)config.default={profile:process.env.RIBBIT_EVAL_PROFILE};const route=routeFor(await resolveInvocation('ask'),config)!;
if(!['127.0.0.1','localhost','[::1]'].includes(new URL(route.endpoint.baseUrl).hostname))throw new Error('This evaluation runner requires a loopback provider');
const fixtures=JSON.parse(await readFile('evals/datasets/core.json','utf8')) as any[];
if(fixtures.length!==250||new Set(fixtures.map(f=>f.id)).size!==250)throw new Error('Invalid fixture count or duplicate IDs');
const attempts:any[]=[];await mkdir('evals/results',{recursive:true});
for(let repetition=1;repetition<=3;repetition++)for(const fixture of fixtures){
 const invocation=await resolveInvocation(fixture.command);invocation.args=fixture.args;
 const budget=new Budget({maxRequests:3,totalMs:30000,requestMs:15000});const started=performance.now();let actual:unknown,error:unknown;
 try{const input=fixture.command==='extract'?{kind:'text' as const,value:fixture.input}:{kind:'records' as const,records:(async function*(){yield{id:fixture.id,value:fixture.input,annotations:{}};})()};const out=await runInvocation(invocation,input,budget,config);if(out.kind==='records'){const rows=await Array.fromAsync(out.records);actual=fixture.command==='filter'?rows.length===1:(rows[0]?.annotations.classify as any)?.label;}else if(out.kind==='json'||out.kind==='text')actual=out.value;}
 catch(e){error={code:(e as any).code??5,message:(e as Error).message};if((e as any).code===3){await writeFile('evals/results/blocked.json',JSON.stringify({fixture:fixture.id,error,attempts},null,2));throw e;}}
 finally{budget.close();}
 attempts.push({id:fixture.id,command:fixture.command,split:fixture.split,repetition,expected:fixture.expected,actual:actual??null,error,requests:budget.requests,additionalAttempts:Math.max(0,budget.requests-1),repairs:budget.repairs,retries:budget.retries,tokens:budget.usageUnknown?null:budget.tokens,elapsedMs:performance.now()-started});
 if(attempts.length%50===0)console.log(`Evaluated ${attempts.length}/750 attempts`);
}
function macroF1(command:string){const rows=attempts.filter(r=>r.command===command),labels=[...new Set(rows.map(r=>JSON.stringify(r.expected)))];return labels.reduce((sum,label)=>{const tp=rows.filter(r=>JSON.stringify(r.expected)===label&&JSON.stringify(r.actual)===label).length,fp=rows.filter(r=>JSON.stringify(r.expected)!==label&&JSON.stringify(r.actual)===label).length,fn=rows.filter(r=>JSON.stringify(r.expected)===label&&JSON.stringify(r.actual)!==label).length;return sum+2*tp/(2*tp+fp+fn||1);},0)/labels.length;}
const extraction=attempts.filter(r=>r.command==='extract');const fieldCorrectness=extraction.reduce((n,r)=>n+Object.keys(r.expected).filter(k=>r.actual?.[k]===r.expected[k]).length,0)/(extraction.length*3);
const scores={filterMacroF1:macroF1('filter'),classifyMacroF1:macroF1('classify'),extractionFieldCorrectness:fieldCorrectness};
const report={schemaVersion:1,date:new Date().toISOString(),model:route.model,provider:route.provider,runtime:Bun.version,cpu:cpus()[0].model,scores,coreThresholdsPass:Object.values(scores).every(s=>s>=.9),releasePass:false,unverified:['independent label review','rubric family scores','model digest/quantization capture','candidate comparison'],attempts};
await writeFile('evals/results/'+route.model.replace(/[^a-zA-Z0-9_-]/g,'_')+'.json',JSON.stringify(report,null,2)+'\n');await writeFile('evals/results/latest.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,attempts:attempts.length},null,2));process.exitCode=1;
