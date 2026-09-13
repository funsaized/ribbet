import {readFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const preset=JSON.parse(await readFile(new URL('../config/lmstudio/qwen38-27b-desktop.json',import.meta.url),'utf8'));
const mode=process.argv[2]??'--show';
if(mode==='--show'){console.log(JSON.stringify(preset,null,2));process.exit(0);}
if(!['--estimate','--load'].includes(mode))throw new Error('Use --show, --estimate or --load');
const sdkPath=process.env.LMSTUDIO_SDK_PATH??join(homedir(),'.lmstudio/extensions/plugins/lmstudio/rag-v1/node_modules/@lmstudio/sdk/dist/index.mjs');
const {LMStudioClient}=await import(pathToFileURL(sdkPath).href);
const client=new LMStudioClient({baseUrl:'ws://127.0.0.1:1234'});
function freeMiB(){const lines=execFileSync('nvidia-smi',['--query-gpu=memory.free','--format=csv,noheader,nounits'],{encoding:'utf8'}).trim().split('\n');if(lines.length!==1)throw new Error('Reconfigure this single-GPU preset for multiple GPUs');const free=Number(lines[0]);if(!Number.isFinite(free))throw new Error('Cannot inspect available VRAM');return free;}
const available=freeMiB();
const local=await client.system.listDownloadedModels();
const found=local.find(m=>m.path===preset.modelKey||m.modelKey===preset.modelKey);
if(!found)throw new Error('Requested model is not indexed in LM Studio yet; refresh its model library.');
const modelKey=found.modelKey??found.path;
const estimate=await client.llm.estimateResourcesUsage(modelKey,preset.load);
const estimatedMiB=estimate.memory.totalVramBytes/1048576;
console.log(JSON.stringify({modelKey,availableMiB:available,estimatedMiB,reserveMiB:preset.minimumFreeVramMiB,estimate},null,2));
if(mode==='--estimate')process.exit(0);
if(!Number.isFinite(estimatedMiB)||estimatedMiB+preset.minimumFreeVramMiB>available)throw new Error('Not enough estimated VRAM headroom; close other GPU models/apps or lower the offload ratio. Nothing loaded.');
const model=await client.llm.load(modelKey,{identifier:preset.identifier,config:preset.load,ttl:preset.idleTtlSeconds});
if(freeMiB()<preset.minimumFreeVramMiB){await model.unload();throw new Error('Unloaded model because the 2 GiB free VRAM reserve was not met.');}
console.log(JSON.stringify({loaded:preset.identifier,freeVramMiB:freeMiB(),loadConfig:await model.getLoadConfig(),predictionDefaults:preset.prediction},null,2));
process.exit(0);
