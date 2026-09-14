import {test,expect} from 'bun:test';
import {exactCommands} from '../../src/builtins/exact.ts';
import {semanticCommands} from '../../src/builtins/semantic.ts';
import {executeAction,Budget,type Context} from '../../src/sdk/index.ts';
function ctx(object:any={}):Context{const budget=new Budget({maxRecords:1000000,maxBytes:128*1024*1024});return{budget,signal:budget.signal,log(){},llm:{async text(){return 'short answer';},async object(){return object;}}};}
async function* rows(values:any[]){for(const[i,value]of values.entries())yield{id:String(i+1),value,annotations:{}};}
async function run(cmd:any,input:any,args:any={},context=ctx()){try{const result=await executeAction(cmd.actions.run,input,args,{},context);return result&&typeof(result as any)[Symbol.asyncIterator]==='function'?await Array.fromAsync(result as AsyncIterable<any>):result;}finally{context.budget.close();}}
test('exact projection, stable sorting and canonical uniqueness',async()=>{
 expect(await run(exactCommands.select,rows([{a:{b:1},other:2}]),{fields:'a.b'})).toMatchObject([{id:'1',value:{a:{b:1}}}]);
 expect((await run(exactCommands.sort,rows([{n:2},{n:1},{n:2}]),{by:'n',type:'number'})as any[]).map(r=>r.id)).toEqual(['2','1','3']);
 expect((await run(exactCommands.unique,rows([{b:2,a:1},{a:1,b:2}]))as any[]).length).toBe(1);
 await expect(run(exactCommands.sort,rows([{n:1},{n:'2'}]),{by:'n',type:'number'})).rejects.toMatchObject({code:2});
});
test('rank rejects fabricated/duplicate IDs before top slicing',async()=>{
 await expect(run(semanticCommands.rank,rows(['a','b']),{instruction:'best',top:1},ctx({ids:['1','1']}))).rejects.toMatchObject({code:4});
 expect((await run(semanticCommands.rank,rows(['a','b']),{instruction:'best',top:1},ctx({ids:['2','1']}))as any[]).map(r=>r.id)).toEqual(['2']);
});
test('filter preserves records, map retains lineage, summarize enforces words',async()=>{
 expect(await run(semanticCommands.filter,rows(['original']),{instruction:'match'},ctx({match:true}))).toEqual([{id:'1',value:'original',annotations:{}}]);
 expect(await run(semanticCommands.map,rows(['original']),{instruction:'rewrite'},ctx())).toMatchObject([{id:'1',value:'short answer',annotations:{map:{originId:'1'}}}]);
 await expect(run(semanticCommands.summarize,'long input',{words:1},ctx())).rejects.toMatchObject({code:4});
});
test('empty semantic record streams make zero requests',async()=>{const c=ctx();c.llm.object=async()=>{throw new Error('Unexpected inference');};for(const name of ['filter','rank','group']as const)expect(await run(semanticCommands[name],rows([]),{instruction:'anything'},c)).toEqual([]);});
test('rank and group error before inference above the 200-record default',async()=>{
 const c=ctx();c.llm.object=async()=>{throw new Error('Unexpected inference');};
 async function* many(){for(let i=0;i<201;i++)yield{id:String(i),value:i,annotations:{}};}
 await expect(run(semanticCommands.rank,many(),{instruction:'best'},c)).rejects.toMatchObject({code:6});
 await expect(run(semanticCommands.group,many(),{instruction:'group'},c)).rejects.toMatchObject({code:6});
});
test('take streams 100k records without extra pulls and sort keeps equal keys stable',async()=>{
 let pulls=0;async function* many(){for(let i=0;i<200000;i++){pulls++;yield{id:String(i),value:i,annotations:{}};}}
 expect((await run(exactCommands.take,many(),{count:100000}) as any[]).length).toBe(100000);expect(pulls).toBe(100000);
 const ties=[{id:'1',value:{n:1,k:'a'},annotations:{}},{id:'2',value:{n:1,k:'b'},annotations:{}},{id:'3',value:{n:0,k:'c'},annotations:{}}];
 expect((await run(exactCommands.sort,(async function*(){yield*ties;})(),{by:'n',type:'number'}) as any[]).map(r=>r.id)).toEqual(['3','1','2']);
},15000);
test('unique accounts key memory against the invocation byte budget',async()=>{
 const budget=new Budget({maxBytes:20,maxRecords:100});const context:Context={budget,signal:budget.signal,log(){},llm:{async text(){throw new Error();},async object(){throw new Error();}}};
 try{await expect(run(exactCommands.unique,rows(['aaaaaaaaaaaaaaaaaaaa','bbbbbbbbbbbbbbbbbbbb']),{},context)).rejects.toMatchObject({code:6});}finally{budget.close();}
});
