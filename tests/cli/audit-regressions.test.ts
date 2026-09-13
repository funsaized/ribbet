import {test,expect} from 'bun:test';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
async function cli(args:string[],input=''){const p=Bun.spawn(['bun',resolve('src/cli/main.ts'),...args],{stdin:new Blob([input]),stdout:'pipe',stderr:'pipe'});return{out:await new Response(p.stdout).text(),err:await new Response(p.stderr).text(),code:await p.exited};}
test('take zero does not discard input referenced by a later flow step',async()=>{const dir=await mkdtemp(join(tmpdir(),'ribbit-zero-flow-'));try{const path=join(dir,'flow.yaml');await writeFile(path,'apiVersion: ribbit/v1\nkind: Flow\nname: reuse\nsteps:\n  - id: empty\n    command: take\n    args: {count: 0}\n  - id: first\n    command: take\n    args: {count: 1}\n    input: {$ref: input}\n');expect(await cli(['flow','run',path,'--input','lines','--output','jsonl'],'A\nB\n')).toEqual({code:0,out:'"A"\n',err:''});}finally{await rm(dir,{recursive:true,force:true});}});
test('flow flags preflight and management JSON errors are consistent',async()=>{
 expect((await cli(['flow','run','--output','nonsense','--','read','/does-not-exist'])).code).toBe(2);
 expect((await cli(['flow','plan','--max-records','-1','--','take','1'])).code).toBe(2);
 expect((await cli(['types','describe','@ribbit/take','--error-format','json'])).code).toBe(0);
 const plan=await cli(['flow','plan','--max-records','3','--','take','1']);expect(JSON.parse(plan.out).limits.maxRecords).toBe(3);
 expect((await cli(['flow','validate','--','take','1'])).code).toBe(0);
});
