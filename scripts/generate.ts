import {mkdir,writeFile} from 'node:fs/promises';
import {builtins} from '../src/builtins/index.ts';
import {manifest,stable} from '../src/sdk/manifest/index.ts';
import {sourceDigest} from '../src/extensions/install/index.ts';
await mkdir('src/generated',{recursive:true});
const sourceHash=await sourceDigest('src/builtins');
const catalog=Object.fromEntries(Object.entries(builtins).sort(([a],[b])=>a.localeCompare(b)).map(([name,command])=>[name,manifest(command,sourceHash,{'@ribbit/sdk':'0.1.0',zod:'4.1.13'})]));
await writeFile('src/generated/catalog.json',stable(catalog)+'\n');
console.log(`Generated ${Object.keys(catalog).length} built-in manifests`);
