import { readFile, writeFile } from 'node:fs/promises';

// Combines the deterministic floor from a rubric run with the independent reviewer verdicts
// and computes the release gate: every family needs >=0.85 on BOTH the deterministic floor
// and the reviewer pass. The reviewer pass is authored as a separate artifact (case-level,
// 30 cases/family); see evals/README.md. This script does no inference.
const runFile = process.env.RIBBIT_RUBRIC_RUN || 'evals/results/rubrics-latest.json';
const reviewFile = process.env.RIBBIT_RUBRIC_REVIEW || 'evals/review/rubrics-review.json';
const run = JSON.parse(await readFile(runFile, 'utf8'));
const review = JSON.parse(await readFile(reviewFile, 'utf8'));
const families = ['rank', 'group', 'reduce', 'compare', 'explain'];
const gate = 0.85;
const verdicts: Record<string, { pass: boolean }> = review.verdicts;

const stats = Object.fromEntries(
  families.map((cmd) => {
    const attempts = run.attempts.filter((a: any) => a.command === cmd);
    const cases: string[] = [...new Set<string>(attempts.map((a: any) => String(a.id)))];
    const detPass = attempts.filter((a: any) => a.pass).length;
    const reviewed = cases.filter((id) => verdicts[id]);
    const revPass = reviewed.filter((id) => verdicts[id].pass).length;
    const detRep1 = cases.map((id) => attempts.find((a: any) => a.id === id && a.repetition === 1)?.pass === true);
    const agree = cases.filter((id, i) => verdicts[id] && detRep1[i] === verdicts[id].pass).length;
    return [
      cmd,
      {
        deterministic: {
          attempts: attempts.length,
          pass: detPass,
          rate: attempts.length ? detPass / attempts.length : 0,
        },
        reviewer: {
          cases: cases.length,
          reviewed: reviewed.length,
          pass: revPass,
          rate: reviewed.length ? revPass / reviewed.length : 0,
        },
        deterministicVsReviewerAgreement: reviewed.length ? agree / reviewed.length : null,
        pass:
          reviewed.length === cases.length && detPass / attempts.length >= gate && revPass / reviewed.length >= gate,
      },
    ];
  }),
);
const report = {
  schemaVersion: 1,
  date: new Date().toISOString(),
  gate,
  runFile,
  reviewFile,
  reviewer: review.reviewer ?? null,
  reviewerKind: review.kind ?? null,
  model: run.model,
  provider: run.provider,
  families: stats,
  pass: families.every((cmd) => (stats[cmd] as any).pass),
};
await writeFile('evals/results/rubrics-gate.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.pass) process.exitCode = 1;
