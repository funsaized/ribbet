import {test,expect} from 'bun:test';
async function cli(args:string[],input=''){const p=Bun.spawn(['bun','src/cli/main.ts',...args],{stdin:new Blob([input]),stdout:'pipe',stderr:'pipe',env:{...process.env,XDG_CONFIG_HOME:'/tmp/ribbit-no-user-config'}});const [out,err,code]=await Promise.all([new Response(p.stdout).text(),new Response(p.stderr).text(),p.exited]);return{out,err,code};}
test('standalone and inline flow preserve record values and keep diagnostics off stdout',async()=>{
 const result=await cli(['flow','run','--input','jsonl','--output','jsonl','--','select','name','::','take','1'],'{"name":"A","n":2}\n{"name":"B"}\n');expect(result).toEqual({code:0,out:'{"name":"A"}\n',err:''});
 const saved=await cli(['flow','run','fixtures/flows/exact.yaml','--input','jsonl','--output','jsonl'],'{"name":"A","n":2}\n');expect(saved).toEqual({code:0,out:'{"name":"A"}\n',err:''});
});
test('exact commands require no configured provider and report typed errors',async()=>{
 expect((await cli(['take','0'],'malformed record data')).code).toBe(0);
 const bad=await cli(['sort','--by','n','--type','number','--input','jsonl','--error-format','json'],'{"n":"wrong"}\n');expect(bad.code).toBe(2);expect(JSON.parse(bad.err).error.code).toBe(2);expect(bad.out).not.toContain('wrong');
 expect((await cli(['render','--as','json','--input','jsonl'],'{"id":"app","value":7,"annotations":{}}\n')).out).toBe('[{"id":"app","value":7,"annotations":{}}]\n');
});
test('empty semantic stream makes no provider request',async()=>{const result=await cli(['filter','match','--input','lines']);expect(result.code).toBe(0);expect(result.err).toBe('');});
