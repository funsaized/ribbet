import { readFile, writeFile } from 'node:fs/promises';
import { scoreReduce, scoreCompare, scoreExplain, type CaseResult } from './rubric-scoring.ts';

// Re-scores a stored rubric run against the current dataset without re-inference. Used after
// reviewer-driven ground-truth corrections: the model outputs are unchanged, only the
// deterministic checks move. Rank and group (structured, engine-enforced) are left as run.
const runFile = process.env.RIBBIT_RUBRIC_RUN || 'evals/results/rubrics-gemma-4-e4b.json';
const dataset = JSON.parse(await readFile('evals/datasets/rubric-cases.json', 'utf8')) as any[];
const byId = new Map(dataset.map((c) => [c.id, c]));
const run = JSON.parse(await readFile(runFile, 'utf8'));

for (const a of run.attempts) {
  const c = byId.get(a.id);
  if (!c) continue;
  let result: CaseResult | null = null;
  if (a.command === 'reduce') result = scoreReduce(a.output, c.expected, c.rubric);
  else if (a.command === 'explain') result = scoreExplain(a.output, c.expected, c.rubric);
  else if (a.command === 'compare') {
    const m = /^Sources: (.+?) \| (.+)$/m.exec(a.output || '');
    const filesUnchanged = (a.criteria || []).find((x: any) => x.text === 'Modifies neither input file')?.pass ?? true;
    if (m) result = scoreCompare(a.output, [m[1], m[2]], c.expected, filesUnchanged);
  }
  if (result) { a.pass = result.pass; a.criteria = result.criteria; }
}

const families = ['rank', 'group', 'reduce', 'compare', 'explain'];
run.families = Object.fromEntries(families.map((cmd) => {
  const rows = run.attempts.filter((a: any) => a.command === cmd);
  const pass = rows.filter((a: any) => a.pass).length;
  return [cmd, { n: rows.length, pass, rate: rows.length ? pass / rows.length : 0 }];
}));
run.deterministicThresholdsPass = families.every((cmd) => run.families[cmd].rate >= 0.85);
run.rescored = (run.rescored ?? 0) + 1;
await writeFile(runFile, JSON.stringify(run, null, 2) + '\n');
await writeFile('evals/results/rubrics-latest.json', JSON.stringify(run, null, 2) + '\n');
console.log(JSON.stringify({ model: run.model, families: run.families, deterministicThresholdsPass: run.deterministicThresholdsPass }, null, 2));
