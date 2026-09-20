import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { sandbox } from './harness.ts';
import { rows } from './cases.ts';

if (process.env.RIBBIT_RUN_LIVE_EVAL !== '1') throw new Error('Set RIBBIT_RUN_LIVE_EVAL=1');
const small = process.argv[2],
  strong = process.argv[3];

if (!small || !strong) throw new Error('Supply SMALL_MODEL STRONG_MODEL (already loaded on loopback LM Studio)');
const env = await sandbox({
  providers: {
    local: {
      type: 'openai-compatible',
      baseUrl: 'http://127.0.0.1:1234/v1',
      capabilities: ['text', 'object', 'stream', 'maxOutputTokens', 'temperature'],
    },
  },
  profiles: {
    'local-small': { provider: 'local', model: small, maxOutputTokens: 2048, temperature: 0 },
    stronger: { provider: 'local', model: strong, maxOutputTokens: 2048, temperature: 0 },
  },
});
const directory = `evals/results/workflows/${new Date().toISOString().replace(/[:.]/g, '-')}`;

await mkdir(directory, { recursive: true });
const attempts: any[] = [];
const sha = (b: Uint8Array) => createHash('sha256').update(b).digest('hex');
const report: any = {
  schemaVersion: 1,
  date: new Date().toISOString(),
  small,
  strong,
  binarySha256: sha(await readFile(env.binary)),
  scriptSha256: sha(await readFile('scripts/release/workflows.ts')),
  repetitions: 3,
  attempts,
  limitations: [
    'Synthetic public fixtures; deterministic fact checks only',
    'No independent reviewer or held-out generalization claim',
    'Wall time includes CLI overhead; provider cache state not controlled',
    'Full evidence is retained; no context-saving claim',
  ],
  acceptance: 'Each recipe/route must satisfy the same fact and source-retention floor on all three repetitions.',
};
const instruction =
  'Prioritize the tickets. Cite every ticket ID and preserve accessibility failures. Treat labels as fallible suggestions; verify against original bodies. Separate observations from hypotheses.';
const source = await readFile('fixtures/release/feedback.jsonl', 'utf8');
const meeting = await readFile('fixtures/release/meeting.txt', 'utf8');

try {
  for (let repetition = 1; repetition <= 3; repetition++)
    for (const recipe of ['triage', 'context', 'brief'])
      for (const mode of ['local-only', 'direct-stronger', 'mixed']) {
        const stages: any[] = [];
        const run = async (args: string[], input = '') => {
          const result = await env.run([...args, '--stats', '--request-ms', '30000', '--total-ms', '90000'], input);
          const stats =
            result.err
              .split('\n')
              .flatMap((line) => {
                try {
                  const v = JSON.parse(line);

                  return 'requests' in v ? [v] : [];
                } catch {
                  return [];
                }
              })
              .at(-1) ?? null;

          stages.push({ args, input, ...result, stats });
          if (result.code) throw new Error(`CLI exit ${result.code}`);

          return result.out;
        };
        const finalProfile = mode === 'local-only' ? 'local-small' : 'stronger';
        let failure = null,
          final = '',
          downstreamBytes = 0,
          evidenceRetention: number | null = null;
        const started = performance.now();

        try {
          if (recipe === 'triage') {
            let evidence = await run(['select', 'ticket,body,component', '--input', 'jsonl'], source);

            if (mode !== 'direct-stronger')
              evidence = await run(
                [
                  'classify',
                  '--field',
                  'body',
                  '--label',
                  'blocking=Prevents a customer from completing a purchase',
                  '--label',
                  'cosmetic=Appearance or wording with no functional impact',
                  '--label',
                  'unknown=Insufficient evidence',
                  '--unknown-label',
                  'unknown',
                  '--profile',
                  'local-small',
                ],
                evidence,
              );
            const admitted = rows(evidence);

            evidenceRetention = admitted.filter((r) => source.includes(JSON.stringify(r.value))).length / 3;
            downstreamBytes = Buffer.byteLength(admitted.map((r) => JSON.stringify(r)).join('\n'));
            final = await run(['reduce', instruction, '--profile', finalProfile], evidence);
            for (const term of ['R1', 'R2', 'R3']) if (!final.includes(term)) throw new Error(`Missing ${term}`);
            if (!/screen reader|accessib/i.test(final)) throw new Error('Missing accessibility issue');
          } else if (recipe === 'context') {
            let evidence = await run([
              'find',
              'repository',
              '--kind',
              'file',
              '--read',
              'content',
              '--max-files',
              '40',
            ]);

            if (mode !== 'direct-stronger')
              evidence = await run(
                [
                  'classify',
                  '--field',
                  'content',
                  '--label',
                  'relevant=Session expiration or request authentication',
                  '--label',
                  'other=Unrelated to authentication',
                  '--profile',
                  'local-small',
                ],
                evidence,
              );
            const admitted = rows(evidence);

            evidenceRetention = admitted.filter((r) => r.source.path === r.value.path && r.value.content).length / 2;
            downstreamBytes = Buffer.byteLength(admitted.map((r) => JSON.stringify(r)).join('\n'));
            final = await run(
              [
                'ask',
                'Explain which source implements session expiration. Cite auth.ts and distinguish colors.ts. State the expiresAt > now condition. Treat labels as fallible.',
                '--profile',
                finalProfile,
              ],
              evidence,
            );
            if (
              !final.includes('auth.ts') ||
              !final.includes('colors.ts') ||
              !final.includes('expiresAt') ||
              !final.includes('now')
            )
              throw new Error('Missing source or condition');
          } else {
            let evidence = meeting;

            if (mode !== 'direct-stronger')
              evidence = await run(
                [
                  'summarize',
                  '--words',
                  '40',
                  '--rule',
                  'Preserve names, dates, amounts, and unresolved questions.',
                  '--profile',
                  'local-small',
                ],
                evidence,
              );
            downstreamBytes = Buffer.byteLength(evidence);
            final = await run(
              [
                'rewrite',
                'Use plain language; preserve every name, date, amount, and unresolved question.',
                '--profile',
                finalProfile,
              ],
              evidence,
            );
            for (const fact of ['Mina', 'Friday', '240']) if (!final.includes(fact)) throw new Error(`Missing ${fact}`);
          }
          if (evidenceRetention !== null && evidenceRetention !== 1) throw new Error('Evidence lost');
        } catch (error) {
          failure = (error as Error).message;
        }
        attempts.push({
          recipe,
          mode,
          repetition,
          stages,
          final,
          failure,
          pass: failure === null,
          elapsedMs: performance.now() - started,
          downstreamBytes,
          evidenceRetention,
          falseNegativesFromSelection: recipe === 'brief' ? null : 0,
          requests: stages.reduce((n, s) => n + (s.stats?.requests ?? 0), 0),
          tokens: stages.some((s) => !s.stats || s.stats.tokens === 'unknown')
            ? null
            : stages.reduce((n, s) => n + s.stats.tokens, 0),
        });
        await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2) + '\n');
        console.log(`${attempts.length}/27 ${recipe} ${mode}: ${failure ?? 'pass'}`);
      }
  report.pass = attempts.every((a) => a.pass);
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(directory);
  if (!report.pass) process.exitCode = 1;
} finally {
  await env.close();
}
