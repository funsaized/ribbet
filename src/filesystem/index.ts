import {lstat,readdir,readFile,realpath,stat} from 'node:fs/promises';
import {resolve,relative,join,basename,sep} from 'node:path';
import ignore from 'ignore';
import {RibbitError,type RecordValue} from '../engine/records/index.ts';
import {textFile} from '../builtins/primitives.ts';
export interface WalkOptions{recursive?:boolean;hidden?:boolean;noIgnore?:boolean;follow?:boolean;outsideRoot?:boolean;includeSensitive?:boolean;glob?:string;kind?:string;depth?:number;maxFiles?:number;maxBytes?:number;read?:'names'|'content';semantic?:boolean;onReadError?:'error'|'skip';}
export interface FileValue{path:string;relativePath:string;kind:'file'|'directory'|'symlink'|'other';sizeBytes:number;modifiedAt:string;content?:string;}
export async function walk(root:string,options:WalkOptions={},log:(s:string)=>void=()=>{}):Promise<RecordValue[]>{
 const absolute=resolve(root),boundary=await realpath(absolute).catch(()=>{throw new RibbitError(7,'Cannot resolve traversal root',root);});
 const records:RecordValue[]=[],visited=new Set<string>();let inspected=0,bytes=0,omitted=0;
 const maxFiles=options.maxFiles??(options.semantic?100:10000),maxBytes=options.maxBytes??8*1024*1024;
 const stack:{base:string;matcher:ReturnType<typeof ignore>}[]=[];
 const sensitive=(path:string)=>path.split(sep).some(p=>p==='.git'||/^\.env(?:\.|$)/.test(p)||/^(?:id_rsa|id_ed25519|credentials)(?:\.|$)/.test(p)||/\.(?:pem|key|p12|pfx)$/i.test(p));
 async function visit(dir:string,depth:number){
  const real=await realpath(dir);if(visited.has(real)){log(`Skipped symlink cycle: ${dir}`);omitted++;return;}visited.add(real);
  if(!options.outsideRoot){const rel=relative(boundary,real);if(rel==='..'||rel.startsWith('..'+sep)||resolve(boundary,rel)!==real){log(`Skipped outside-root link: ${dir}`);omitted++;return;}}
  const base=relative(absolute,dir);let added=false;
  if(!options.noIgnore){const matcher=ignore();for(const name of ['.gitignore','.ribbitignore']){try{matcher.add(await readFile(join(dir,name),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}}stack.push({base,matcher});added=true;}
  try{
   for(const entry of(await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)){
    const path=join(dir,entry.name),rel=relative(absolute,path);
    if(!options.hidden&&entry.name.startsWith('.'))continue;
    let meta;try{meta=await lstat(path);}catch(e){if(options.onReadError==='skip'){omitted++;log(`Skipped unreadable path: ${path}`);continue;}throw e;}
    let kind:FileValue['kind']=meta.isSymbolicLink()?'symlink':meta.isDirectory()?'directory':meta.isFile()?'file':'other';
    let directory=meta.isDirectory();if(meta.isSymbolicLink()&&options.follow){try{directory=(await stat(path)).isDirectory();}catch(e){if(options.onReadError==='skip'){omitted++;log(`Skipped broken link: ${path}`);continue;}throw e;}}
    let ignored=false;if(!options.noIgnore)for(const rule of stack){const sub=relative(join(absolute,rule.base),path).split(sep).join('/')+(directory?'/':'');const result=rule.matcher.test(sub);if(result.ignored)ignored=true;else if(result.unignored)ignored=false;}if(ignored)continue;
    if(options.semantic&&!options.includeSensitive&&sensitive(rel)){omitted++;log(`Excluded sensitive-name candidate: ${rel}`);continue;}
    if(++inspected>maxFiles)throw new RibbitError(6,`Traversal exceeds ${maxFiles} inspected entries`);
    if((!options.glob||new Bun.Glob(options.glob).match(rel.split(sep).join('/')))&&(!options.kind||options.kind===kind)){
     const value:FileValue={path,relativePath:rel,kind,sizeBytes:meta.size,modifiedAt:meta.mtime.toISOString()};let include=true;
     if(options.read==='content'&&kind==='file'){
      try{value.content=await textFile(path,maxBytes-bytes);bytes+=Buffer.byteLength(value.content);}
      catch(e){if(e instanceof RibbitError&&e.code===2&&e.message.includes('Binary')){omitted++;log(`Skipped binary content: ${path}`);include=false;}else if(options.onReadError==='skip'&&e instanceof RibbitError&&e.code===7){omitted++;log(`Skipped unreadable content: ${path}`);include=false;}else throw e;}
     }
     if(include)records.push({id:String(records.length+1),value:value as unknown as RecordValue['value'],source:{path},annotations:{}});
    }
    if(directory&&(options.recursive??false)&&depth<(options.depth??Infinity)){if(meta.isSymbolicLink()&&!options.follow)continue;await visit(path,depth+1);}
   }
  }finally{if(added)stack.pop();}
 }
 try{await visit(absolute,1);}catch(error){if(error instanceof RibbitError)throw error;throw new RibbitError(7,'Filesystem traversal failed',root);}
 if(omitted)log(JSON.stringify({event:'filesystem.omissions',count:omitted}));return records;
}
