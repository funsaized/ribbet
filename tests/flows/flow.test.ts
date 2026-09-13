import {test,expect} from 'bun:test';
import {planFlow,executeFlow} from '../../src/flows/index.ts';
import {configSchema} from '../../src/config/index.ts';
import {Budget} from '../../src/sdk/index.ts';
const config=configSchema.parse({});
const flow=(steps:unknown[],output?:unknown)=>({apiVersion:'ribbit/v1',kind:'Flow',name:'test',steps,...(output===undefined?{}:{output})});
test('flow plans reject future references and duplicate IDs without inference',async()=>{
 await expect(planFlow(flow([{id:'a',command:'take',args:{count:1},input:{$ref:'steps.b.output'}}]),config)).rejects.toThrow('future');
 await expect(planFlow(flow([{id:'a',command:'take',args:{count:1}},{id:'a',command:'take',args:{count:1}}]),config)).rejects.toThrow('Duplicate');
});
test('linear record flow streams and take stops upstream',async()=>{
 const plan=await planFlow(flow([{id:'a',command:'take',args:{count:2}},{id:'b',command:'take',args:{count:1}}]),config);let pulls=0;
 const budget=new Budget();try{const result=await executeFlow(plan,{kind:'records',records:(async function*(){for(let i=0;i<10;i++){pulls++;yield{id:String(i),value:i,annotations:{}};}})()},budget,config);expect(result.kind).toBe('records');if(result.kind==='records')expect((await Array.fromAsync(result.records)).map(r=>r.value)).toEqual([0]);expect(pulls).toBe(1);}finally{budget.close();}
});
test('reused outputs retain values and reject missing field paths',async()=>{
 const plan=await planFlow(flow([{id:'a',command:'take',args:{count:2}},{id:'b',command:'take',args:{count:1},input:{$ref:'steps.a.output'}}],{$ref:'steps.a.output'}),config);
 const budget=new Budget();try{const out=await executeFlow(plan,{kind:'records',records:(async function*(){yield{id:'a',value:1,annotations:{}};yield{id:'b',value:2,annotations:{}};})()},budget,config);expect(out.kind).toBe('records');if(out.kind==='records')expect((await Array.fromAsync(out.records)).length).toBe(2);}finally{budget.close();}
});
test('detectable schema mismatches and invalid paths fail during planning',async()=>{
 await expect(planFlow({...flow([{id:'a',command:'take',args:{count:1}}]),input:{type:'string'}},config)).rejects.toThrow('schema mismatch');
 await expect(planFlow({...flow([{id:'a',command:'ask',args:{instruction:'test'},input:{$ref:'input.missing'}}]),input:{type:'object',properties:{known:{type:'string'}},additionalProperties:false}},config)).rejects.toThrow('absent from schema');
});

test('parallel references share one materialization without losing rows',async()=>{
 const plan=await planFlow(flow([{id:'a',command:'take',args:{count:2}}],{left:{$ref:'steps.a.output'},right:{$ref:'steps.a.output'}}),config);let pulls=0;const budget=new Budget();try{const out=await executeFlow(plan,{kind:'records',records:(async function*(){for(let i=0;i<2;i++){pulls++;yield{id:String(i),value:i,annotations:{}};}})()},budget,config);expect(out.kind).toBe('json');if(out.kind==='json'){const value=out.value as any;expect(value.left).toEqual(value.right);expect(value.left.length).toBe(2);}expect(pulls).toBe(2);}finally{budget.close();}
});
test('unconsumed intermediate stream failures stop later independent steps',async()=>{
 const plan=await planFlow(flow([{id:'bad',command:'select',args:{fields:'missing'}},{id:'later',command:'take',args:{count:0},input:[]}]),config);const budget=new Budget();try{await expect(executeFlow(plan,{kind:'records',records:(async function*(){yield{id:'a',value:{present:1},annotations:{}};})()},budget,config)).rejects.toMatchObject({code:2});}finally{budget.close();}
});
test('reference argument types and unknown fields fail preflight',async()=>{
 await expect(planFlow({...flow([{id:'a',command:'take',args:{count:{$ref:'input'}}}]),input:{type:'string'}},config)).rejects.toThrow('Reference schema mismatch');
 await expect(planFlow({...flow([{id:'a',command:'take',args:{count:{$ref:'input'},bogus:true}}]),input:{type:'integer'}},config)).rejects.toThrow('Unknown argument');
});
