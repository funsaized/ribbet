import {writeFile} from 'node:fs/promises';
const cases:any[]=[];
for(let i=0;i<100;i++){
 const positive=i%2===0;
 cases.push({id:`filter-${i}`,split:i<20?'development':'held-out',command:'filter',args:{instruction:'Keep reports of failed network connections or network timeouts.'},input:`Service ${i}: ${positive?(i%4===0?'connection timed out while contacting the database':'network connection refused by the remote service'):(i%4===1?'connection established successfully':'processed a local file successfully')}.`,expected:positive});
 const labels=['bug','feature','praise','unknown'];const label=labels[i%4];const phrases=['The Save button crashes the application.','Please add an export-to-CSV option.','The interface is excellent and easy to use.','No product feedback is available.'];
 cases.push({id:`classify-${i}`,split:i<20?'development':'held-out',command:'classify',args:{labels:labels.join(',')},input:`Feedback ticket ${i}: ${phrases[i%4]}`,expected:label});
}
for(let i=0;i<50;i++){const owner=i%5===0?null:`Person ${i}`,due=i%3===0?null:`2026-10-${String(i%28+1).padStart(2,'0')}`;cases.push({id:`extract-${i}`,split:i<10?'development':'held-out',command:'extract',args:{instruction:'Extract the task title, owner and due date. Use null for facts not stated.',schema:'evals/datasets/task.schema.json'},input:`Task title: Review item ${i}. ${owner?`Owner: ${owner}.`: 'No owner assigned.'} ${due?`Due: ${due}.`:'No due date given.'}`,expected:{title:`Review item ${i}`,owner,due}});}
await writeFile('evals/datasets/core.json',JSON.stringify(cases,null,2)+'\n');
await writeFile('evals/datasets/task.schema.json',JSON.stringify({type:'object',properties:{title:{type:'string'},owner:{anyOf:[{type:'string'},{type:'null'}]},due:{anyOf:[{type:'string'},{type:'null'}]}},required:['title','owner','due'],additionalProperties:false},null,2)+'\n');
const families=['rank','group','reduce','compare','explain'];const rubrics=families.flatMap(command=>Array.from({length:30},(_,i)=>({id:`${command}-${i}`,split:i<6?'development':'held-out',command,evidence:[{id:'a',value:`Incident ${i}: confirmed outage blocks all customers.`},{id:'b',value:`Incident ${i}: optional cosmetic improvement.`},{id:'c',value:`Incident ${i}: customer impact is not known.`}],rubric:['Preserves all stated facts and uncertainty.','Does not invent causes, remedies already performed, or evidence.','Prioritizes the confirmed outage when ranking; partitions each record exactly once when grouping.','Output is relevant to the requested task and identifies supporting evidence.']})));
await writeFile('evals/datasets/rubric-cases.json',JSON.stringify(rubrics,null,2)+'\n');
console.log(`Generated ${cases.length} core and ${rubrics.length} rubric cases; reviewer audit remains required`);
