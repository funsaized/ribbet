import {z,defineCommand,defineAction,jsonValueSchema,recordSchema,RibbitError,type Action,type RecordValue} from '../sdk/index.ts';
import {canonical,type Json} from '../engine/records/index.ts';
import {take as takeStream} from '../engine/execution/index.ts';
import {field,pathParts,collect,textFile} from './primitives.ts';
const config=z.strictObject({});
function recordCommand(name:string,description:string,args:z.ZodType,execute:Action['execute'],options:Partial<Action>={}){return defineCommand({type:`@ribbit/${name}`,version:'1.0.0',description,config,actions:{run:defineAction({config,description,args,input:recordSchema,output:recordSchema,mode:'records',inputKind:'records',outputKind:'records',capabilities:[],effects:[],barrier:false,execute,...options} as Action)}});}
function assign(root:any,path:string,value:Json){const parts=pathParts(path);let current=root;for(let i=0;i<parts.length;i++){const p=parts[i];if(Array.isArray(current)&&typeof p==='number')while(current.length<=p)current.push(null);if(i===parts.length-1){current[p]=structuredClone(value);return;}if(current[p]===null||typeof current[p]!=='object')current[p]=typeof parts[i+1]==='number'?[]:{};current=current[p];}}
export const exactCommands={
 select:recordCommand('select','Project selected value fields, preserving IDs',z.strictObject({fields:z.string().min(1),missing:z.enum(['error','null']).default('error')}),async function*({args,input},ctx){const a=args as any,paths=a.fields.split(',');for(const p of paths)pathParts(p);for await(const r of input as AsyncIterable<RecordValue>){const value={};for(const path of paths){assign(value,path,field(r.value,path,a.missing));if(Buffer.byteLength(JSON.stringify(value))>ctx.budget.limits.maxBytes)throw new RibbitError(6,'Projection exceeds byte limit');}yield {...r,value};}},{cli:{positionals:['fields']}}),
 sort:recordCommand('sort','Stable exact sort by a string or numeric field',z.strictObject({by:z.string().min(1),descending:z.boolean().default(false),type:z.enum(['number','string'])}),async function*({args,input},ctx){const a=args as any;pathParts(a.by);const rows=await collect(input as AsyncIterable<unknown>,ctx.budget.limits.maxRecords);const keyed=rows.map((r,index)=>{const key=field(r.value,a.by);if(typeof key!==a.type)throw new RibbitError(2,`Sort field must be ${a.type}`);return {r,key:key as string|number,index};});keyed.sort((a1,b)=>{const order=a1.key<b.key?-1:a1.key>b.key?1:0;return (a.descending?-order:order)||a1.index-b.index;});for(const item of keyed)yield item.r;},{barrier:true}),
  unique:recordCommand('unique','Keep the first record for each canonical JSON value',z.strictObject({by:z.string().optional()}),async function*({args,input},ctx){const a=args as any;if(a.by)pathParts(a.by);const keys=new Set<string>();let stored=0;for await(const r of input as AsyncIterable<RecordValue>){const key=canonical(a.by?field(r.value,a.by):r.value);if(!keys.has(key)){stored+=Buffer.byteLength(key);if(stored>ctx.budget.limits.maxBytes)throw new RibbitError(6,'Unique key set exceeds byte limit');keys.add(key);yield r;}}}),
 take:recordCommand('take','Take the first N records and stop upstream reads',z.strictObject({count:z.number().int().nonnegative()}),async function*({args,input}){yield* takeStream(input as AsyncIterable<RecordValue>,(args as any).count);},{cli:{positionals:['count']}}),
 render:defineCommand({type:'@ribbit/render',version:'1.0.0',description:'Render final values without inference or executable templates',config,actions:{run:defineAction({config,description:'Render text, JSON, JSONL, table or safe substitutions',args:z.strictObject({as:z.enum(['text','table','json','jsonl']).default('text'),template:z.string().optional()}),input:jsonValueSchema,output:z.string(),mode:'value',inputKind:'any',outputKind:'display',capabilities:[],effects:['filesystem-read'],barrier:true,execute:async({args,input},ctx)=>{
    const finish=(text:string)=>{if(Buffer.byteLength(text)>ctx.budget.limits.maxBytes)throw new RibbitError(6,'Render output exceeds byte limit');return text;};
// eslint-disable-next-line no-control-regex -- intentional: escapes control characters
    const safe=(text:string)=>text.replace(/[\u0000-\u001f\u007f-\u009f]/g,(c:string)=>`\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`);
    const value=input as any,rows=ctx.inputKind==='records'&&Array.isArray(value)?value.map(r=>r.value):Array.isArray(value)?value:[value];
    if(args.template){const template=await textFile(args.template,ctx.budget.limits.maxBytes);return finish(rows.map(row=>template.replace(/\{\{([^{}]+)\}\}/g,(_,path)=>{const v=field(row,path.trim());return safe(typeof v==='string'?v:JSON.stringify(v));})).join('\n'));}
    if(args.as==='json')return finish(JSON.stringify(Array.isArray(value)?rows:value));
    if(args.as==='jsonl')return finish(rows.map(row=>JSON.stringify(row)).join('\n'));
    const display=(v:any)=>typeof v==='string'?v:JSON.stringify(v);
    if(args.as==='text')return finish(rows.map(row=>safe(display(row))).join('\n'));
    const columns=[...new Set(rows.flatMap(row=>row&&typeof row==='object'&&!Array.isArray(row)?Object.keys(row):['value']))];
// eslint-disable-next-line no-control-regex -- intentional: escapes control characters
    const escape=(v:any)=>display(v??'').replace(/[\u0000-\u001f\u007f]/g,(c:string)=>`\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`);
    return finish([columns.map(escape).join('\t'),...rows.map(row=>columns.map(col=>escape(row&&typeof row==='object'&&!Array.isArray(row)?row[col]:row)).join('\t'))].join('\n'));
 }})}}),
};
