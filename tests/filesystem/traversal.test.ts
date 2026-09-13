import {test,expect} from 'bun:test';
import {mkdtemp,writeFile,mkdir,symlink,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {walk} from '../../src/filesystem/index.ts';
test('nested ignores, hidden/sensitive files and bounded content discovery',async()=>{
 const root=await mkdtemp(join(tmpdir(),'ribbit-fs-'));const messages:string[]=[];
 try{await mkdir(join(root,'sub'));await writeFile(join(root,'.gitignore'),'ignored.txt\n');await writeFile(join(root,'ignored.txt'),'ignore');await writeFile(join(root,'visible.txt'),'hi');await writeFile(join(root,'.env'),'secret');await writeFile(join(root,'sub','.gitignore'),'hidden.txt\n');await writeFile(join(root,'sub','hidden.txt'),'ignore');await writeFile(join(root,'sub','code.ts'),'code');await writeFile(join(root,'binary.bin'),new Uint8Array([0,1]));await symlink(root,join(root,'sub','loop'));
 const rows=await walk(root,{recursive:true,follow:true,read:'content',semantic:true,hidden:true},s=>messages.push(s));
 const names=rows.map(r=>(r.value as any).relativePath);expect(names).toContain('visible.txt');expect(names).toContain('sub/code.ts');expect(names).not.toContain('.env');expect(names).not.toContain('ignored.txt');expect(names).not.toContain('sub/hidden.txt');expect(names).not.toContain('binary.bin');expect(messages.some(m=>m.includes('cycle'))).toBe(true);
 await expect(walk(root,{maxFiles:1})).rejects.toMatchObject({code:6});
 }finally{await rm(root,{recursive:true,force:true});}
});
