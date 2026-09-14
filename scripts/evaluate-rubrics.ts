import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {cpus} from 'node:os';
import {loadConfig} from '../src/config/index.ts';
import {resolveInvocation} from '../src/definitions/index.ts';
import {runInvocation,routeFor} from '../src/engine/runtime/index.ts';
import {Budget} from '../src/sdk/index.ts';
if(process.env.RIBBIT_RUN_LIVE_EVAL!=='1')throw new Error('Set RIBBIT_RUN_LIVE_EVAL=1 to authorize local evaluation requests');
const config=await loadConfig();if(process.env.RIBBIT_EVAL_PROFILE)config.default={profile:process.env.RIBBIT_EVAL_PROFILE};
const route=routeFor(await resolveInvocation('ask'),config)!;
const cases=JSON.parse(await readFile('evals/datasets/rubric-cases.json','utf8')) as any[];
if(cases.length!==150)throw new Error('Expected 150 rubric cases');
const reps=Number(process.env.RIBBIT_EVAL_REPS||3);
const attempts:any[]=[];await mkdir('evals/results',{recursive:true});
function records(evidence:any[]){return {kind:'records' as const,records:(async function*(){for(const row of evidence)yield{id:row.id,value:row.value,annotations:{}};})()};}
function text(value:unknown){return typeof value==='string'?value:JSON.stringify(value);}
function invented(s:string){return /executed|reboot|deleted the|applied a patch|ran the command/i.test(s);}
function score(cmd:string,out:unknown,paths?:string[]){
  const s=text(out);
  if(cmd==='rank'){const rows=out as any[];const ids=rows.map(r=>r.id);return ids.length===3&&new Set(ids).size===3&&ids.every((id:string)=>['a','b','c'].includes(id))&&ids[0]==='a';}
  if(cmd==='group'){const rows=out as any[];const ids=rows.flatMap(r=>(r.value?.members??[]).map((m:any)=>m.id??m));return ids.length===3&&new Set(ids).size===3&&['a','b','c'].every(id=>ids.includes(id));}
  if(cmd==='compare')return !!paths&&paths.every(p=>s.includes(p))&&/outage/i.test(s)&&!invented(s);
  return s.length>20&&/outage/i.test(s)&&/(unknown|not known|uncertain|optional|cosmetic)/i.test(s)&&!invented(s);
}
for(let repetition=1;repetition<=reps;repetition++)for(const fixture of cases){
  const invocation=await resolveInvocation(fixture.command);
  const budget=new Budget({maxRequests:3,totalMs:Number(process.env.RIBBIT_EVAL_TOTAL_MS||180000),requestMs:Number(process.env.RIBBIT_EVAL_REQUEST_MS||120000)});
  const started=performance.now();let actual:unknown,error:unknown,pass=false,dir='';
  try{
    let input:any,args:any;
    if(fixture.command==='compare'){
      dir=await mkdtemp(join(tmpdir(),'ribbit-rubric-'));
      const left=join(dir,'left.txt'),right=join(dir,'right.txt');
      await writeFile(left,String(fixture.evidence[0].value)+'\n');await writeFile(right,String(fixture.evidence[1].value)+'\n');
      invocation.args={paths:[left,right],focus:'customer impact'};input={kind:'json',value:null};
      const out=await runInvocation(invocation,input,budget,config);actual=out.kind==='text'||out.kind==='json'?out.value:null;pass=score('compare',actual,[left,right]);
    }else{
      invocation.args=fixture.command==='rank'?{instruction:'Rank by confirmed customer impact, most severe first.'}:fixture.command==='group'?{instruction:'Partition by confirmed outage, optional cosmetic, or unknown impact.'}:fixture.command==='reduce'?{instruction:'Summarize without inventing causes or completed remedies.'}:{};
      input=records(fixture.evidence);
      const out=await runInvocation(invocation,input,budget,config);
      if(out.kind==='records')actual=await Array.fromAsync(out.records);else if(out.kind!=='textStream')actual=out.value;else actual=null;
      pass=score(fixture.command,actual);
    }
  }catch(e){error={code:(e as any).code??5,message:(e as Error).message};}
  finally{budget.close();if(dir)await rm(dir,{recursive:true,force:true});}
  attempts.push({id:fixture.id,command:fixture.command,split:fixture.split,repetition,pass,actual:actual??null,error,elapsedMs:performance.now()-started});
  console.log(`${attempts.length}/${cases.length*reps} ${fixture.id} ${pass?'PASS':'FAIL'} ${error?'ERR':''}`);
}
const families=Object.fromEntries(['rank','group','reduce','compare','explain'].map(cmd=>{const rows=attempts.filter(a=>a.command===cmd);return [cmd,{n:rows.length,pass:rows.filter(a=>a.pass).length,rate:rows.filter(a=>a.pass).length/rows.length}];}));
const report={schemaVersion:1,date:new Date().toISOString(),model:route.model,provider:route.provider,quantization:process.env.RIBBIT_EVAL_QUANT||null,runtime:Bun.version,cpu:cpus()[0].model,families,familyThresholdsPass:Object.values(families).every((f:any)=>f.rate>=.85),attempts};
await writeFile('evals/results/rubrics-'+route.model.replace(/[^a-zA-Z0-9_-]/g,'_')+'.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,attempts:attempts.length},null,2));
if(!report.familyThresholdsPass)process.exitCode=1;
