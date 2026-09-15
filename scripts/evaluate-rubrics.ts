import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir, cpus } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { loadConfig } from '../src/config/index.ts';
import { resolveInvocation } from '../src/definitions/index.ts';
import { runInvocation, routeFor } from '../src/engine/runtime/index.ts';
import { Budget } from '../src/sdk/index.ts';
import { scoreRank, scoreGroup, scoreReduce, scoreCompare, scoreExplain, type CaseResult } from './rubric-scoring.ts';

// Runs the five rubric families through the engine and records the deterministic factuality
// floor plus every raw output. The independent reviewer pass is applied afterwards by
// scripts/rubric-gate.ts from evals/review/rubrics-review.json (the reviewer is not a model
// call inside this runner; see evals/README.md).
if (process.env.RIBBIT_RUN_LIVE_EVAL !== '1') throw new Error('Set RIBBIT_RUN_LIVE_EVAL=1 to authorize local evaluation requests');
const config = await loadConfig();
if (process.env.RIBBIT_EVAL_PROFILE) config.default = { profile: process.env.RIBBIT_EVAL_PROFILE };
const route = routeFor(await resolveInvocation('ask'), config)!;
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(route.endpoint.baseUrl).hostname)) throw new Error('This evaluation runner requires a loopback provider');

const cases = JSON.parse(await readFile(process.env.RIBBIT_EVAL_DATASET || 'evals/datasets/rubric-cases.json', 'utf8')) as any[];
if (cases.length !== 150 || new Set(cases.map((c: any) => c.id)).size !== 150) throw new Error('Expected 150 unique rubric cases');
const per = Number(process.env.RIBBIT_EVAL_PER || 0);
let fixtures = cases;
if (per) fixtures = ['rank', 'group', 'reduce', 'compare', 'explain'].flatMap((cmd) => cases.filter((c: any) => c.command === cmd).slice(0, per));
const reps = Number(process.env.RIBBIT_EVAL_REPS || 3);

const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const attempts: any[] = [];
await mkdir('evals/results', { recursive: true });

for (let repetition = 1; repetition <= reps; repetition++) {
  for (const fixture of fixtures) {
    const invocation = await resolveInvocation(fixture.command);
    const budget = new Budget({ maxRequests: 3, totalMs: Number(process.env.RIBBIT_EVAL_TOTAL_MS || 180000), requestMs: Number(process.env.RIBBIT_EVAL_REQUEST_MS || 120000) });
    const started = performance.now();
    let error: unknown, dir = '', rendered = '';
    let result: CaseResult | null = null;
    try {
      if (fixture.command === 'compare') {
        dir = await mkdtemp(join(tmpdir(), 'ribbit-rubric-'));
        const left = join(dir, 'left.txt'), right = join(dir, 'right.txt');
        await writeFile(left, String(fixture.input.left) + '\n');
        await writeFile(right, String(fixture.input.right) + '\n');
        const before = sha(await readFile(left, 'utf8')) + sha(await readFile(right, 'utf8'));
        invocation.args = { paths: [left, right], focus: fixture.args.focus };
        const out = await runInvocation(invocation, { kind: 'text', value: '' }, budget, config);
        const after = sha(await readFile(left, 'utf8')) + sha(await readFile(right, 'utf8'));
        rendered = out.kind === 'text' ? String(out.value) : '';
        result = scoreCompare(rendered, [left, right], fixture.expected, before === after);
      } else if (fixture.command === 'rank' || fixture.command === 'group') {
        const records = fixture.input.records as { id: string; value: string }[];
        invocation.args = { instruction: fixture.args.instruction };
        const out = await runInvocation(invocation, { kind: 'records', records: (async function* () { for (const r of records) yield { id: r.id, value: r.value, annotations: {} }; })() }, budget, config);
        const rows = out.kind === 'records' ? await Array.fromAsync(out.records) : [];
        const byId = new Map(records.map((r) => [r.id, r.value]));
        if (fixture.command === 'rank') {
          const valuesUnchanged = rows.every((r: any) => JSON.stringify(r.value) === JSON.stringify(byId.get(r.id)));
          result = scoreRank(rows.map((r: any) => r.id), records.map((r) => r.id), fixture.expected, valuesUnchanged);
          rendered = JSON.stringify(rows.map((r: any) => ({ id: r.id, value: r.value })));
        } else {
          const groups = rows.map((r: any) => ({ label: r.value?.label ?? '', memberIds: (r.value?.members ?? []).map((m: any) => m.id ?? m) }));
          const valuesUnchanged = rows.every((r: any) => (r.value?.members ?? []).every((m: any) => JSON.stringify(m.value) === JSON.stringify(byId.get(m.id ?? m))));
          result = scoreGroup(groups, records.map((r) => r.id), fixture.expected, valuesUnchanged);
          rendered = JSON.stringify(groups);
        }
      } else if (fixture.command === 'reduce') {
        const records = fixture.input.records as { id: string; value: string }[];
        invocation.args = { instruction: fixture.args.instruction, strategy: 'direct' };
        const out = await runInvocation(invocation, { kind: 'records', records: (async function* () { for (const r of records) yield { id: r.id, value: r.value, annotations: {} }; })() }, budget, config);
        rendered = out.kind === 'text' ? String(out.value) : '';
        result = scoreReduce(rendered, fixture.expected, fixture.rubric);
      } else if (fixture.command === 'explain') {
        invocation.args = { focus: fixture.args.focus, audience: fixture.args.audience };
        const out = await runInvocation(invocation, { kind: 'text', value: String(fixture.input.value) }, budget, config);
        rendered = out.kind === 'text' ? String(out.value) : '';
        result = scoreExplain(rendered, fixture.expected, fixture.rubric);
      }
    } catch (e) {
      error = { code: (e as any).code ?? 5, message: (e as Error).message };
      if ((e as any).code === 3) { await writeFile('evals/results/rubrics-blocked.json', JSON.stringify({ fixture: fixture.id, error, attempts }, null, 2)); throw e; }
    } finally {
      budget.close();
      if (dir) await rm(dir, { recursive: true, force: true });
    }
    attempts.push({ id: fixture.id, command: fixture.command, split: fixture.split, repetition, expected: fixture.expected, output: rendered, pass: result?.pass ?? false, criteria: result?.criteria ?? [], error, elapsedMs: performance.now() - started });
    console.log(`${attempts.length}/${fixtures.length * reps} ${fixture.id} det=${result?.pass ? 'PASS' : 'FAIL'} ${error ? 'ERR' : ''} ${Math.round(performance.now() - started)}ms`);
    await writeFile('evals/results/rubrics-in-progress.json', JSON.stringify({ attempts: attempts.length, last: fixture.id, error: error ?? null, elapsedMs: performance.now() - started }, null, 2));
  }
}

const families = ['rank', 'group', 'reduce', 'compare', 'explain'];
const rate = (rows: any[]) => ({ n: rows.length, pass: rows.filter((a) => a.pass).length, rate: rows.length ? rows.filter((a) => a.pass).length / rows.length : 0 });
const familyStats = Object.fromEntries(families.map((cmd) => [cmd, rate(attempts.filter((a) => a.command === cmd))]));
const report = {
  schemaVersion: 2, date: new Date().toISOString(), model: route.model, provider: route.provider,
  quantization: process.env.RIBBIT_EVAL_QUANT || null, runtime: Bun.version, cpu: cpus()[0].model,
  hardware: 'NVIDIA GeForce RTX 3080 Ti 12 GiB',
  families: familyStats, deterministicThresholdsPass: families.every((cmd) => (familyStats[cmd] as any).rate >= 0.85),
  reviewPending: true,
  unverified: ['independent reviewer pass', 'human factuality review'],
  scoring: 'deterministic factuality floor; independent reviewer pass applied by scripts/rubric-gate.ts',
  attempts, screen: !!per,
};
await writeFile('evals/results/rubrics-' + route.model.replace(/[^a-zA-Z0-9_-]/g, '_') + '.json', JSON.stringify(report, null, 2) + '\n');
if (!per) await writeFile('evals/results/rubrics-latest.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, attempts: attempts.length }, null, 2));
if (!report.deterministicThresholdsPass) process.exitCode = 1;
