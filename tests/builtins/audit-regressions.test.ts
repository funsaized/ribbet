import {test,expect} from 'bun:test';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {field,pathParts,textFile} from '../../src/builtins/primitives.ts';
import {exactCommands} from '../../src/builtins/exact.ts';
import {Budget,executeAction,type Context} from '../../src/sdk/index.ts';
test('exact readers retain BOM and field paths accept hyphens with bounded indices',async()=>{expect(field({'a-b':2},'a-b')).toBe(2);expect(()=>pathParts('a[1000000001]')).toThrow('bounds');const dir=await mkdtemp(join(tmpdir(),'ribbit-bom-'));try{const path=join(dir,'bom.txt');await writeFile(path,'\ufefftext');expect(await textFile(path)).toBe('\ufefftext');}finally{await rm(dir,{recursive:true,force:true});}});
test('display escapes unsafe headers and text while JSON preserves values',async()=>{const budget=new Budget(),ctx:Context={budget,signal:budget.signal,log(){},llm:{async text(){throw new Error();},async object(){throw new Error();}}};try{const render=async(input:unknown,args:unknown)=>executeAction(exactCommands.render.actions.run,input,args,{},ctx);expect(await render({'\u001b[31mheader':'value'},{as:'table'})).not.toContain('\u001b');expect(await render('\u001b[31mtext',{as:'text'})).toBe('\\u001b[31mtext');expect(JSON.parse(await render('\u001b[31mtext',{as:'json'}) as string)).toBe('\u001b[31mtext');}finally{budget.close();}});
