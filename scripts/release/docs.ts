import { writeFile } from 'node:fs/promises';
import { cases } from './cases.ts';

const quote = (s: string) => (/^[a-zA-Z0-9_./@-]+$/.test(s) ? s : `'${s.replaceAll("'", "'\\''")}'`);
const lines = [
  '# Command examples and acceptance cases',
  '',
  'Run these examples in a scratch copy of `fixtures/release`, with the installed binary on PATH. Record examples below consume `records` containing two original feedback records with IDs a/b; text examples consume the supplied meeting text unless noted. Exact fixture inputs, mocked provider replies, and assertions live in [the case catalog](../scripts/release/cases.ts). Tests execute the packaged CLI, not just internal helpers.',
  '',
  'Semantic examples require `--profile YOUR_PROFILE` or a configured default. Canned replies in contract tests prove wiring and invariants, not model correctness. See [model evidence](models.md) for live results.',
  '',
  '| Case | Invocation | Input | Output/assertion |',
  '| --- | --- | --- | --- |',
];
const claims: Record<string, string> = {
  ask: 'Grounded answer; embedded evidence instructions do not override the task',
  summarize: 'Names/deadline/amount retained; word maximum enforced',
  explain: 'Both sizes preserved; no claim of executing code',
  rewrite: 'Owner/deadline/amount retained',
  extract: 'Owner Mina; absent reviewer null',
  classify: 'Original values/IDs/sources retained with allowed labels',
  filter: 'Only matching original retained, without alteration',
  rank: 'All originals in criterion order; exact permutation',
  group: 'Each original belongs to one component group',
  map: 'One result per input; IDs/sources/origin lineage retained',
  reduce: 'Required evidence survives direct or explicit chunked reduction',
  compare: 'Both source names, retry limits, unchanged owner',
  ls: 'Only actual file records with source paths',
  find: 'Exact glob or relevant real file with supplied content',
  tree: 'Actual topology; complete descriptions; explicit evidence mode',
  read: 'Two separate original contents and source paths',
  select: 'Projected values; original IDs/sources retained',
  sort: 'Numeric ordering of original records',
  unique: 'First original for each exact component key',
  take: 'First original only',
  render: 'Bare values only; deliberate metadata loss',
};

for (const c of cases())
  lines.push(
    `| ${c.id} | \`ribbit ${[c.command, ...c.args].map(quote).join(' ')}\` | ${c.input?.startsWith('{"$ribbit"') ? 'records on stdin' : c.input ? 'case-specific text on stdin' : 'fixture paths'} | ${claims[c.command]} |`,
  );
lines.push(
  '| pick (TTY) | `ribbit pick --file feedback.jsonl --input jsonl --label body --query checkout` | fixture file | Real fzf, original selection, cancellation 130 |',
  '| pick semantic (TTY) | `ribbit pick --file feedback.jsonl --input jsonl --label body --about "Most severe customer impact first"` | fixture file | Rank originals first; live acceptance selects R1 |',
  '',
  'The packaged [failure tests](../tests/release/commands.test.ts) cover invalid/missing input, absent fields and files, malformed JSON, invalid labels, fabricated rank/group IDs, and error channels. [Contract regressions](../tests/builtins/audit-regressions.test.ts) additionally cover shared compare budgets, safe display, picker payload integrity, and bounded field access. Filesystem, record, budget, and flow suites supply the broader invariants.',
  '',
  "Useful record input can be produced with `ribbit read`, `ribbit find`, or `--input jsonl`. Field selectors address `record.value`; they do not expose annotations. To process classification metadata externally, keep wire records and explicitly read each record's `annotations.classify.label`. No undocumented metadata field selector is implied.",
);
await writeFile('docs/command-examples.md', lines.join('\n') + '\n');
