import { test, expect } from 'bun:test';
import { cp, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { sandbox, mockProvider } from '../../scripts/release/harness.ts';
import { rows } from '../../scripts/release/cases.ts';

// Captured CI excerpt plus controlled inference; see fixture provenance.
const FIXTURE = 'fixtures/tutorials/failing-ci';
const SOURCES = ['ci.log', 'changes.diff', 'src/builtins/exact.ts', 'tests/release/projection-baseline.test.fixture'];
const SIGNATURE_PATH = join(FIXTURE, 'failure-signature.txt');

async function prepare() {
  const provider = mockProvider(),
    env = await sandbox(provider.config);

  await cp(FIXTURE, env.dir, { recursive: true });
  await mkdir(join(env.dir, 'commands'), { recursive: true });
  await cp('examples/commands/diagnose-ci.yaml', join(env.dir, 'commands/diagnose-ci.yaml'));

  return { provider, env };
}

function recognize(log: string): string {
  const match = log.match(/^\(fail\) (.*?)(?: \[\d+(?:\.\d+)?ms\])?$/m);

  if (!match) throw new Error('No failing test signature in log');

  return `(fail) ${match[1]}`;
}

const diagnosis = (signature: string) => ({
  failureSignature: signature,
  observations: [
    'ci.log reports output validation failing in the projection keeps annotations after classify test.',
    'changes.diff replaces yield { ...r, value } with yield { id: r.id, value } in src/builtins/exact.ts.',
    'src/builtins/exact.ts excerpt line 9 identifies the branch source line 113 yielding only id and value.',
  ],
  hypotheses: ['select drops the record source and annotations, so classify labels never reach the projected records.'],
  sources: [
    { path: 'ci.log', line: 17 },
    { path: 'changes.diff', line: 6 },
    { path: 'src/builtins/exact.ts', line: 9 },
    { path: 'tests/release/projection-baseline.test.fixture', line: 39 },
  ],
  likelyChange: {
    path: 'src/builtins/exact.ts',
    line: 9,
    reason: 'select returns a new object with only id and value, discarding source and annotations.',
  },
  nextChecks: [
    'bun test tests/release/projection-baseline.test.ts',
    'ribbit flow run examples/flows/diagnose-ci.yaml --output json',
  ],
});

test('diagnose-ci flow sends bounded evidence and returns a referenced structured diagnosis', async () => {
  const { provider, env } = await prepare();
  const expected = (await readFile(SIGNATURE_PATH, 'utf8')).trim();

  try {
    const plan = await env.run(['flow', 'plan', 'examples/flows/diagnose-ci.yaml']);

    expect(plan.code, plan.err).toBe(0);
    expect(JSON.parse(plan.out).steps.map((s: any) => s.route?.model ?? null)).toEqual([null, 'strong']);
    expect(provider.requests.length).toBe(0);

    for (const command of [
      ['commands', 'validate', 'diagnose-ci', '--json'],
      ['commands', 'describe', 'diagnose-ci', '--json'],
    ]) {
      const result = await env.run(command);

      expect(result.code, result.err).toBe(0);
    }
    expect(provider.requests.length).toBe(0);

    provider.reset([diagnosis(expected)]);
    const run = await env.run(['flow', 'run', 'examples/flows/diagnose-ci.yaml']);

    expect(run.code, run.err).toBe(0);
    const output = JSON.parse(run.out);

    expect(Object.keys(output).toSorted()).toEqual(
      ['failureSignature', 'hypotheses', 'likelyChange', 'nextChecks', 'observations', 'sources'].toSorted(),
    );
    expect(output.failureSignature).toBe(expected);
    expect(output.observations.length).toBeGreaterThan(0);
    expect(output.hypotheses.length).toBeGreaterThan(0);
    expect(output.nextChecks.length).toBeGreaterThan(0);
    expect(provider.requests.length).toBe(1);
    expect(provider.requests[0].model).toBe('strong');

    const evidence = provider.requests[0].messages[1].content;

    for (const source of SOURCES) expect(evidence).toContain(source);
    for (const line of [
      expected,
      '(fail) projection keeps annotations after classify',
      'yield { ...r, value };',
      'yield { id: r.id, value };',
      'r.annotations.classify',
    ])
      expect(evidence).toContain(line);
    expect(provider.requests[0].messages[0].content).toContain('observations and hypotheses distinct');

    // The known signature is recognized from the log, not inferred from status.
    expect(recognize(await readFile(join(env.dir, 'ci.log'), 'utf8'))).toBe(expected);

    // Every reported source reference resolves to a real, non-empty line.
    for (const source of output.sources) {
      const lines = (await readFile(join(env.dir, source.path), 'utf8')).split('\n');

      expect(source.line).toBeLessThanOrEqual(lines.length);
      expect(lines[source.line - 1].trim().length).toBeGreaterThan(0);
    }
    expect((await readFile(join(env.dir, output.likelyChange.path), 'utf8')).split('\n')[8]).toBe(
      '113 |         yield { id: r.id, value };',
    );
    expect(
      (await readFile(join(env.dir, 'tests/release/projection-baseline.test.fixture'), 'utf8')).split('\n')[38],
    ).toContain('r.annotations.classify');
  } finally {
    await env.close();
    provider.close();
  }
}, 15000);

test('saved read evidence keeps lineage and rejects short-circuited diagnosis', async () => {
  const { provider, env } = await prepare();

  try {
    const read = await env.run(['read', ...SOURCES, '--output', 'records']);

    expect(read.code, read.err).toBe(0);
    const records = rows(read.out);

    expect(records.map((r: any, i: number) => r.value.path.endsWith(SOURCES[i]))).toEqual(SOURCES.map(() => true));
    expect(records.map((r: any) => r.id)).toEqual(['1', '2', '3', '4']);
    expect(records.every((r: any) => r.source.path === r.value.path && r.value.content.length > 0)).toBe(true);

    const exported = await env.run(['render', '--as', 'jsonl'], read.out);

    const bare = exported.out
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    expect(bare.length).toBe(SOURCES.length);
    expect(bare.every((value: any) => Object.keys(value).toSorted().join(',') === 'content,path')).toBe(true);
    expect(provider.requests.length).toBe(0);

    const empty = await env.run(['run', 'diagnose-ci', '--input', 'text'], '');

    expect(empty.code).toBe(2);
    expect(provider.requests.length).toBe(0);

    provider.reset([{ observations: [] }, { observations: [] }]);
    const invalid = await env.run(['run', 'diagnose-ci', '--input', 'text'], 'evidence');

    expect(invalid.code).toBe(4);
    expect(invalid.out).not.toContain('nextChecks');
    expect(provider.requests.length).toBe(2);
  } finally {
    await env.close();
    provider.close();
  }
}, 15000);
