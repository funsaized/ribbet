import {test,expect} from 'bun:test';
import {z,defineAction,defineCommand} from '../../src/sdk/index.ts';
import {manifest,hash} from '../../src/sdk/manifest/index.ts';
import {parseAction} from '../../src/cli/parser/index.ts';
const config=z.strictObject({});
const cmd=defineCommand({type:'@test/parse',version:'1.0.0',description:'parser',config,actions:{run:defineAction({config,description:'parse',args:z.strictObject({prompt:z.string(),rule:z.array(z.string()).optional(),count:z.number().int().default(1),nested:z.strictObject({x:z.string()}).optional()}),input:z.string(),output:z.string(),mode:'value',capabilities:[],effects:[],cli:{positionals:['prompt']},execute:({input})=>input})}});
const action=manifest(cmd,hash('x')).actions.run;
test('generated positional/scalar/repeated flags and runtime separation',()=>{expect(parseAction(['hello world','--rule','a','--rule','b','--count','2','--profile','local'],action)).toEqual({args:{prompt:'hello world',rule:['a','b'],count:2},runtime:{profile:'local'}});});
test('JSON conflicts, unknown fields and complex flag values fail',()=>{for(const tokens of [['x','--args-json','{"rule":["a"]}','--rule','b'],['x','--no-such','v'],['x','--nested','{}'],['x','--args-json','{"extra":1}']])expect(()=>parseAction(tokens,action)).toThrow();});
