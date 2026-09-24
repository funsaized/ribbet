import { test, expect } from 'bun:test';
import { cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { sandbox, mockProvider } from '../../scripts/release/harness.ts';
import { rows } from '../../scripts/release/cases.ts';

// Pinned date-fns checkout excerpts; see fixtures/tutorials/date-fns/PROVENANCE.md.
const SOURCES = [
  'AGENTS.md',
  'CONTRIBUTING.md',
  'pkgs/core/package.json',
  'pkgs/core/src/constants/index.ts',
  'pkgs/core/src/parseISO/index.ts',
  'pkgs/core/src/parseISO/test.ts',
];

// Controlled local excerpts, not a model transcript.
const RELEVANT_LINES = [
  'additionalDigits',
  'function parseTimezone',
  'function validateTimezone',
  'returns `Invalid Date` for invalid timezone minutes',
  'parses 24:00 as midnight of the next day',
];

async function prepare() {
  const provider = mockProvider(),
    env = await sandbox(provider.config);

  await cp('fixtures/tutorials/date-fns', env.dir, { recursive: true });
  await mkdir(join(env.dir, 'commands'), { recursive: true });
  await cp('examples/commands/contribution-brief.yaml', join(env.dir, 'commands/contribution-brief.yaml'));

  return { provider, env };
}

test('date-fns contribution flow sends pinned source paths and returns a controlled brief', async () => {
  const { provider, env } = await prepare();
  const brief = 'Public behavior: parseISO parses ISO 8601 strings. Next checks: run the parseISO suite.';

  try {
    const plan = await env.run(['flow', 'plan', 'examples/flows/date-fns-context.yaml']);

    expect(plan.code, plan.err).toBe(0);
    expect(JSON.parse(plan.out).steps.map((s: any) => s.route?.model ?? null)).toEqual([null, 'small']);
    expect(provider.requests.length).toBe(0);

    for (const command of [
      ['commands', 'validate', 'contribution-brief', '--json'],
      ['commands', 'describe', 'contribution-brief', '--json'],
    ]) {
      const result = await env.run(command);

      expect(result.code, result.err).toBe(0);
    }
    expect(provider.requests.length).toBe(0);

    provider.reset([brief]);
    const run = await env.run(['flow', 'run', 'examples/flows/date-fns-context.yaml']);

    expect(run.code, run.err).toBe(0);
    expect(run.out.trim()).toBe(brief);
    expect(provider.requests.length).toBe(1);
    expect(provider.requests[0].model).toBe('small');

    const evidence = provider.requests[0].messages[1].content;

    for (const source of SOURCES) expect(evidence).toContain(source);
    for (const line of RELEVANT_LINES) expect(evidence).toContain(line);
    expect(provider.requests[0].messages[0].content).toContain('Do not assert an upstream bug');
  } finally {
    await env.close();
    provider.close();
  }
}, 15000);

test('read evidence keeps source metadata and a pipeline reproduces the flow output', async () => {
  const { provider, env } = await prepare();
  const brief = 'Coverage: existing timezone and invalid-input tests.';

  try {
    const read = await env.run(['read', ...SOURCES, '--output', 'records']);

    expect(read.code, read.err).toBe(0);
    const records = rows(read.out);

    expect(records.map((r: any, i: number) => r.value.path.endsWith(SOURCES[i]))).toEqual(SOURCES.map(() => true));
    expect(records.map((r: any) => r.id)).toEqual(['1', '2', '3', '4', '5', '6']);
    expect(records.every((r: any) => r.source.path === r.value.path && r.value.content.length > 0)).toBe(true);
    const exported = await env.run(['render', '--as', 'jsonl'], read.out);

    const bare = exported.out
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    expect(bare.length).toBe(SOURCES.length);
    expect(bare.every((value: any) => Object.keys(value).toSorted().join(',') === 'content,path')).toBe(true);

    provider.reset([brief]);
    const piped = await env.run(['run', 'contribution-brief', '--input', 'records'], read.out);

    expect(piped.code, piped.err).toBe(0);
    expect(piped.out.trim()).toBe(brief);
    expect(provider.requests.length).toBe(1);
  } finally {
    await env.close();
    provider.close();
  }
}, 15000);
