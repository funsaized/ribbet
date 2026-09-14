import {test,expect} from 'bun:test';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {field,pathParts,textFile} from '../../src/builtins/primitives.ts';
import {exactCommands} from '../../src/builtins/exact.ts';
import {pickerSelections} from '../../src/builtins/filesystem.ts';
import {Budget,executeAction,type Context} from '../../src/sdk/index.ts';
test('exact readers retain BOM and field paths accept hyphens with bounded indices',async()=>{expect(field({'a-b':2},'a-b')).toBe(2);expect(()=>pathParts('a[1000000001]')).toThrow('bounds');expect(()=>pathParts('$ref')).toThrow('Invalid field path');expect(()=>pathParts('a.$b')).toThrow('Invalid field path');const dir=await mkdtemp(join(tmpdir(),'ribbit-bom-'));try{const path=join(dir,'bom.txt');await writeFile(path,Buffer.from([0xef,0xbb,0xbf,0x41]));expect(await textFile(path)).toBe('\ufeffA');expect(await textFile(path,4)).toBe('\ufeffA');await expect(textFile(path,3)).rejects.toMatchObject({code:6});}finally{await rm(dir,{recursive:true,force:true});}});
test('display escapes unsafe headers and text while JSON preserves values',async()=>{const budget=new Budget(),ctx:Context={budget,signal:budget.signal,log(){},llm:{async text(){throw new Error();},async object(){throw new Error();}}};try{const render=async(input:unknown,args:unknown)=>executeAction(exactCommands.render.actions.run,input,args,{},ctx);expect(await render({'\u001b[31mheader':'value'},{as:'table'})).not.toContain('\u001b');expect(await render('\u001b[31mtext',{as:'text'})).toBe('\\u001b[31mtext');expect(JSON.parse(await render('\u001b[31mtext',{as:'json'}) as string)).toBe('\u001b[31mtext');expect(await render([],{as:'table'})).toBe('');expect(await render({name:'日本語'},{as:'table'})).toContain('日本語');expect(JSON.parse(await render({nested:{n:1}},{as:'json'}) as string)).toEqual({nested:{n:1}});}finally{budget.close();}});
test('picker validates the full backend payload before yielding originals',()=>{
 const rows=[{id:'a',value:1,annotations:{}},{id:'b',value:2,annotations:{}}];
 expect(pickerSelections(['0\tlabel','1\tother'].join('\0')+'\0',rows)).toEqual(rows);
 expect(()=>pickerSelections(['0\tok','0\tdup'].join('\0')+'\0',rows)).toThrow('Invalid picker');
 expect(()=>pickerSelections(['0\tok','99\tbad'].join('\0')+'\0',rows)).toThrow('Invalid picker');
 expect(()=>pickerSelections('nope\tlabel\0',rows)).toThrow('Invalid picker');
});
test('templates and render output honor invocation byte budgets',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'ribbit-tpl-'));const budget=new Budget({maxBytes:16});const ctx:Context={budget,signal:budget.signal,log(){},llm:{async text(){throw new Error();},async object(){throw new Error();}}};
 try{const path=join(dir,'t.txt');await writeFile(path,'{{a}}{{a}}{{a}}');await expect(executeAction(exactCommands.render.actions.run,{a:'0123456789'},{template:path},{},ctx)).rejects.toMatchObject({code:6});await writeFile(path,'{{missing}}');await expect(executeAction(exactCommands.render.actions.run,{a:1},{template:path},{},ctx)).rejects.toMatchObject({code:2});}finally{budget.close();await rm(dir,{recursive:true,force:true});}
});
