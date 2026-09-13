import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadConfig} from '../src/config/index.ts';
import {resolveInvocation} from '../src/definitions/index.ts';
import {runInvocation} from '../src/engine/runtime/index.ts';
import {Budget} from '../src/sdk/index.ts';
const {LMStudioClient}=await import(pathToFileURL(process.env.LMSTUDIO_SDK_PATH??join(homedir(),'.lmstudio/extensions/plugins/lmstudio/rag-v1/node_modules/@lmstudio/sdk/dist/index.mjs')).href);
const client=new LMStudioClient({baseUrl:'ws://127.0.0.1:1234'});
const model=await client.llm.model('ribbit-qwen27b');
const report:any={date:new Date().toISOString(),preset:JSON.parse(await readFile('config/lmstudio/qwen38-27b-desktop.json','utf8')),loadConfig:await model.getLoadConfig(),context:[],quality:[]};
delete report.loadConfig.promptTemplate;
let samples:number[]=[];let unsafe=false;
const timer=setInterval(()=>{try{const free=Number(execFileSync('nvidia-smi',['--query-gpu=memory.free','--format=csv,noheader,nounits'],{encoding:'utf8'}).trim());samples.push(free);if(free<2048){unsafe=true;void model.unload();}}catch{}},1000);
const save=()=>writeFile('evals/results/quick-screen.json',JSON.stringify({...report,minimumFreeVramMiB:Math.min(...samples),unsafe},null,2)+'\n');
try{
 for(const [index,position] of ['beginning','middle','end'].entries()){
  if(unsafe)throw Error('VRAM reserve violated');
  const answer=['cobalt-7319','maple-4826','quartz-9051'][index];
  const filler=Array.from({length:650},(_,i)=>`Archive entry ${i}: routine inventory review completed; no special access code is recorded here.`);
  let count=350,prompt='';
  for(let n=0;n<4;n++){
   const rows=filler.slice(0,count);rows.splice(position==='beginning'?0:position==='middle'?Math.floor(rows.length/2):rows.length,0,`The secret access code for Project Lantern is ${answer}.`);
   prompt=`Read the archive and return only the secret access code for Project Lantern.\n${rows.join('\n')}\nWhat is the secret access code for Project Lantern? Return only the code.`;
   const tokens=(await model.tokenize(prompt)).length;if(Math.abs(tokens-7000)<100)break;count=Math.max(1,Math.min(650,Math.round(count*7000/tokens)));
  }
  const row:any={position,expected:answer,inputTokensWithoutChatTemplate:(await model.tokenize(prompt)).length};
  const start=performance.now();const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),240000);let text='',reasoning='',buffer='';
  try{
   const response=await fetch('http://127.0.0.1:1234/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'ribbit-qwen27b',messages:[{role:'user',content:prompt}],temperature:.6,top_p:.95,top_k:20,min_p:0,repeat_penalty:1,presence_penalty:0,reasoning_effort:'low',max_tokens:256,stream:true,stream_options:{include_usage:true}}),signal:controller.signal});
   if(!response.ok)throw Error(await response.text());
   const decoder=new TextDecoder();for await(const chunk of response.body!){buffer+=decoder.decode(chunk,{stream:true});let end;while((end=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,end).trim();buffer=buffer.slice(end+1);if(!line.startsWith('data: ')||line==='data: [DONE]')continue;const event=JSON.parse(line.slice(6));const delta=event.choices?.[0]?.delta;if(delta?.content||delta?.reasoning_content){row.firstTokenMs??=performance.now()-start;if(delta.content)row.firstAnswerTokenMs??=performance.now()-start;text+=delta.content??'';reasoning+=delta.reasoning_content??'';}if(event.usage)row.usage=event.usage;if(event.choices?.[0]?.finish_reason)row.finishReason=event.choices[0].finish_reason;}}
   row.actual=text;row.reasoning=reasoning;row.pass=text.trim()===answer;
  }catch(e){row.error=String(e);row.pass=false;}finally{clearTimeout(timeout);row.elapsedMs=performance.now()-start;}
  report.context.push(row);await save();console.log(JSON.stringify({section:'context',...row,reasoning:undefined}));
 }
 const config=await loadConfig();config.default={profile:'local-27b'};
 const all=JSON.parse(await readFile('evals/datasets/core.json','utf8'));
 for(const command of ['filter','classify','extract']){
  const candidates=all.filter((r:any)=>r.command===command&&r.split==='held-out');
  const pool=candidates.length>=10?candidates:all.filter((r:any)=>r.command===command);
  for(const fixture of pool.slice(0,10)){
   if(unsafe)throw Error('VRAM reserve violated');
   const invocation=await resolveInvocation(command);invocation.args=fixture.args;
   const budget=new Budget({maxRequests:2,totalMs:60000,requestMs:45000});const start=performance.now();const row:any={id:fixture.id,command,split:fixture.split,expected:fixture.expected};
   try{const input=command==='extract'?{kind:'text' as const,value:fixture.input}:{kind:'records' as const,records:(async function*(){yield{id:fixture.id,value:fixture.input,annotations:{}};})()};const out=await runInvocation(invocation,input,budget,config);if(out.kind==='records'){const rows=await Array.fromAsync(out.records);row.actual=command==='filter'?rows.length===1:(rows[0]?.annotations.classify as any)?.label;}else if(out.kind==='json'||out.kind==='text')row.actual=out.value;row.pass=command==='extract'?Object.keys(fixture.expected).every(k=>row.actual?.[k]===fixture.expected[k]):row.actual===fixture.expected;}catch(e){row.error=String(e);row.pass=false;}finally{budget.close();row.elapsedMs=performance.now()-start;row.requests=budget.requests;row.repairs=budget.repairs;row.retries=budget.retries;}
   report.quality.push(row);await save();console.log(JSON.stringify({section:'quality',...row}));
  }
 }
}finally{clearInterval(timer);await save();}

// The bundled SDK keeps a WebSocket open after requests finish.
process.exit(0);
