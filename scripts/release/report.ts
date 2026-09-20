import { readdir, readFile, writeFile } from 'node:fs/promises';
import { cases } from './cases.ts';

async function completed(directory: string) {
  try {
    const result: { path: string; report: any }[] = [];

    for (const name of (await readdir(directory)).toSorted()) {
      const path = `${directory}/${name}/report.json`;

      try {
        const report = JSON.parse(await readFile(path, 'utf8'));

        if (typeof report.pass === 'boolean') result.push({ path, report });
      } catch {}
    }

    return result;
  } catch {
    return [];
  }
}

const commands = await completed('evals/results/release');
const strong = commands
  .filter((r) => r.report.model === 'google/gemma-4-e4b' && r.report.maxOutputTokens === 2048)
  .at(-1);
const small = commands.filter((r) => r.report.model === 'ribbit-release-small').at(-1);
const workflows = (await completed('evals/results/workflows')).at(-1);
const handoff = (await completed('evals/results/handoff')).at(-1);
const link = (r: { path: string } | undefined) => (r ? `[raw report](../${r.path})` : 'not run');
const score = (r: typeof strong, command: string) => {
  if (!r) return 'not run';
  const selected = r.report.attempts.filter((a: any) => a.command === command);

  return selected.length ? `${selected.filter((a: any) => a.pass).length}/${selected.length}` : 'n/a';
};
const all = [...new Set([...cases().map((c) => c.command), 'pick'])].toSorted();
const matrix = [
  '# Individual release acceptance',
  '',
  'Contract and packaged-CLI checks are separate from live semantic correctness. All command rows below have packaged happy-path coverage plus relevant failure/invariant coverage. Live scores are small public regression samples, not broad quality certification or independent review. The current [release checklist](release-checklist.md) determines release readiness.',
  '',
  'Run `npm run build && npm run test:release`. The [case catalog](../scripts/release/cases.ts) supplies exact args, inputs, mock replies, and assertions; [command examples](command-examples.md) render them for readers. `pick` additionally uses the real fzf backend on a controlling PTY. The [failure suite](../tests/release/commands.test.ts) and the existing filesystem/record/budget suites cover relevant edge behavior.',
  '',
  '| Command | Case IDs / modes | Contract + packaged CLI | Stronger live floor | 0.5B live floor | Verdict |',
  '| --- | --- | --- | --- | --- | --- |',
];

for (const command of all) {
  const fixtures = cases().filter((c) => c.command === command);
  const semantic = fixtures.some((c) => c.semantic) || command === 'pick';

  matrix.push(
    `| ${command} | ${fixtures.map((c) => c.id).join(', ') || 'exact, semantic ranking, cancellation'} | PASS | ${score(strong, command)} | ${score(small, command)} | ${semantic ? 'Contract accepted; semantic use experimental and profile-specific' : 'Deterministic behavior accepted on tested Linux candidate'} |`,
  );
}
matrix.push(
  '',
  `Stronger model evidence: ${link(strong)}. Small model evidence: ${link(small)}. Scores aggregate modes only for display; raw case verdicts remain authoritative. A failed mode is never waived by other passing cases.`,
  '',
  '## Management surfaces',
  '',
  'Evidence: [packaged lifecycle tests](../tests/release/management.test.ts), [recipe tests](../tests/release/recipes.test.ts), and existing CLI/extension tests.',
  '',
  '| Surface | Checked behavior | Verdict |',
  '| --- | --- | --- |',
);
for (const [surface, behavior] of [
  ['setup', 'Discovery returns versioned data, performs no download or config mutation'],
  ['doctor', 'Configuration, picker presence, installed extension health, explicit model probe'],
  ['providers', 'Add/list/remove and referenced-provider rejection'],
  ['models', 'Explicit provider discovery against mock HTTP'],
  ['profiles', 'Set/show/list/remove and route selection'],
  ['route', 'Semantic model provenance and exact no-inference inspection'],
  ['commands', 'List/describe every built-in; validate named definition'],
  ['types', 'List and scoped contract description'],
  ['extensions', 'Scaffold/check/test/add/list/remove; source preserved'],
  ['run', 'Named defaults and invocation override'],
  ['flow', 'Validate/plan/run; saved/inline/OS-pipe equivalence; routing and budget failure'],
  ['init', 'Idempotent project/guidance initialization preserves owner text'],
  ['completions', 'bash/zsh/fish include named definitions'],
])
  matrix.push(`| ${surface} | ${behavior} | PASS in packaged tests |`);
matrix.push(
  '',
  'These are bounded acceptance cases, not exhaustive subcommand fuzzing. Real remote-provider conformance, independent user onboarding, and additional native platforms remain separate release decisions/checks.',
);
await writeFile('docs/release-acceptance.md', matrix.join('\n') + '\n');
const models = [
  '# Model evidence and route selection',
  '',
  'Choose routes per task. There is no universal small-model default and no hardware-independent quality claim. The current local regression compares an installed Qwen2.5 0.5B Q4_K_M (`ribbit-release-small`, 4096 loaded context) with Gemma 4 E4B Q4_K_M (`google/gemma-4-e4b`, 8192 loaded context), through LM Studio on this Linux workstation. Both model files were already installed; no model download was performed.',
  '',
  'The runner uses temperature 0, at most 2048 output tokens, 30-second requests, 90-second command budgets, and three repetitions. Quantization is identified from the installed filenames; file digests, runtime, and hardware provenance are in [environment evidence](../evals/results/release-environment.json). Token usage may be unknown because the provider did not report it; unknown is not zero.',
  '',
  `Stronger report: ${link(strong)}. Small report: ${link(small)}. [Individual acceptance](release-acceptance.md) breaks down every command and optional mode.`,
  '',
  '| Semantic command | Stronger passing attempts | 0.5B passing attempts |',
  '| --- | --- | --- |',
];

for (const command of all.filter((name) => cases().some((c) => c.command === name && c.semantic) || name === 'pick'))
  models.push(`| ${command} | ${score(strong, command)} | ${score(small, command)} |`);
models.push(
  '',
  'The stronger model previously exhausted a 512-token allowance on explain, reduce, and compare. Those failed runs remain recorded; the 2048-token experiment is a different explicit resource configuration. Template-specific thinking controls are not universally honored. A small visible answer can still require substantial internal generation.',
  '',
  'The 0.5B model is unsuitable as an automatic filter on this evidence: it repeatedly retained the wrong record. Its grouping, adversarial instruction handling, and chunked reduction also failed cases. Passing simple extraction or summarization fixtures does not establish suitability for arbitrary inputs. Prefer preserved originals and annotations when a downstream reviewer must catch mistakes.',
  '',
  '## End-to-end comparison',
  '',
  `Workflow evidence: ${link(workflows)}. The same three fixture jobs were run local-only, direct-stronger, and mixed, three times each. All stages and full outputs are recorded. Downstream bytes measure evidence bytes at the final model boundary, not tokens.`,
  '',
  '| Recipe | Route | Passes | Mean wall time (ms) | Mean final evidence bytes |',
  '| --- | --- | --- | --- | --- |',
);
if (workflows)
  for (const recipe of ['triage', 'context', 'brief'])
    for (const mode of ['local-only', 'direct-stronger', 'mixed']) {
      const rows = workflows.report.attempts.filter((a: any) => a.recipe === recipe && a.mode === mode);
      const mean = (key: string) => Math.round(rows.reduce((n: number, a: any) => n + a[key], 0) / rows.length);

      models.push(
        `| ${recipe} | ${mode} | ${rows.filter((a: any) => a.pass).length}/${rows.length} | ${mean('elapsedMs')} | ${mean('downstreamBytes')} |`,
      );
    }
models.push(
  '',
  'Interpret these as observations on tiny fixtures and an uncontrolled shared workstation, not benchmark rankings. The annotation-based recipes retain all evidence and can increase final context size and latency. A direct stronger-model call is often simpler. The brief recipe reduces text volume but can lose facts; its floor checks names, dates, and amounts. No monetary savings or general quality improvement is established.',
  '',
  '## Harness boundary',
  '',
  `Live Codex handoff: ${link(handoff)}. ${handoff?.report.pass ? 'PASS: the local harness consumed the record stream and returned the required source names and expiration condition.' : 'Live compatibility is not established.'} This is one bounded read-only interpretation task, not an evaluation of autonomous coding or tool-use reliability.`,
  '',
  '## Limits and reproduction',
  '',
  'These are public, authored regression cases. They are not held out, were not independently reviewed, and use deterministic fact checks as a floor. Older synthetic datasets and their reviews are retained as historical evidence, not current cross-domain validation. Model suitability remains experimental until diverse held-out tasks and independent review support broader claims.',
  '',
  'Run `npm run eval:release -- --help` for per-command selection. `--mode smoke` runs every selected case once; `--mode full` repeats them three times. The [evaluation guide](../evals/README.md) documents local-only opt-in, raw attempt retention, recipe comparisons, and harness checks.',
);
await writeFile('docs/models.md', models.join('\n') + '\n');
