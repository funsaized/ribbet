import {test,expect} from 'bun:test';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {scaffold,testExtension} from '../../src/scaffold/index.ts';
test('nested scaffold creates parents, protects existing source and reports invalid fixtures',async()=>{const dir=await mkdtemp(join(tmpdir(),'ribbit-scaffold-')),source=join(dir,'extensions','greeting');try{await scaffold(source);const original=await readFile(join(source,'index.ts'),'utf8');await expect(scaffold(source)).rejects.toMatchObject({code:2});expect(await readFile(join(source,'index.ts'),'utf8')).toBe(original);expect((await testExtension(source)).failed).toBe(0);await writeFile(join(source,'fixtures','invalid.json'),'{broken');const report=await testExtension(source);expect(report.failed).toBe(1);expect(report.results.find(r=>r.file==='invalid.json')).toMatchObject({error:2,location:'invalid.json'});}finally{await rm(dir,{recursive:true,force:true});}},15000);
