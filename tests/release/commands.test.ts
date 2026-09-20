import { test, expect } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cases } from '../../scripts/release/cases.ts';
import { sandbox, mockProvider, parseStats } from '../../scripts/release/harness.ts';

for (const fixture of cases())
  test(`packaged ${fixture.id}${fixture.semantic ? ' (mock inference)' : ' (no inference)'}`, async () => {
    const provider = mockProvider();
    const env = await sandbox(provider.config);

    provider.reset(fixture.replies ?? []);
    try {
      const before = await readFile(join(env.dir, 'before.txt'));
      const result = await env.run([fixture.command, ...fixture.args, '--stats'], fixture.input);

      expect(result.code, result.err).toBe(0);
      fixture.check(result.out);
      expect(provider.remaining()).toBe(0);
      expect(provider.requests.length).toBe(fixture.replies?.length ?? 0);
      expect(await readFile(join(env.dir, 'before.txt'))).toEqual(before);
      expect(JSON.parse(result.err.trim().split('\n').at(-1)!).requests).toBe(provider.requests.length);
    } finally {
      await env.close();
      provider.close();
    }
  });

test('packaged individual failure contracts', async () => {
  const provider = mockProvider(),
    env = await sandbox(provider.config);

  try {
    for (const [args, input, code] of [
      [['ask'], '', 2],
      [['summarize'], '', 2],
      [['explain'], '', 2],
      [['rewrite', 'polite'], '', 2],
      [['extract', 'owner', '--schema', 'missing.json'], 'evidence', 7],
      [['classify', '--labels', 'a,a', '--input', 'lines'], 'value', 2],
      [['filter', 'match', '--input', 'jsonl'], '{bad', 2],
      [['map', 'title', '--field', 'absent', '--input', 'jsonl'], '{}', 2],
      [['reduce', 'summary'], '', 2],
      [['compare', 'before.txt'], '', 2],
      [['ls', 'absent'], '', 7],
      [['find', 'absent'], '', 7],
      [['tree', 'absent'], '', 7],
      [['read', 'absent'], '', 7],
      [['select', 'absent', '--input', 'jsonl'], '{}', 2],
      [['sort', '--by', 'n', '--type', 'number', '--input', 'jsonl'], '{"n":"bad"}', 2],
      [['unique', '--by', 'absent', '--input', 'jsonl'], '{}', 2],
      [['take', '-1'], '', 2],
      [['render', '--template', 'absent'], 'text', 7],
    ] as [string[], string, number][]) {
      provider.reset([]);
      const result = await env.run([...args, '--error-format', 'json'], input);

      expect(result.code, args.join(' ') + ': ' + result.err).toBe(code);
      expect(JSON.parse(result.err).error.code).toBe(code);
      expect(provider.requests.length).toBe(0);
    }
    for (const command of ['rank', 'group']) {
      provider.reset(
        command === 'rank' ? [{ ids: ['invented'] }] : [{ groups: [{ label: 'bad', ids: ['invented'] }] }],
      );
      const result = await env.run([command, 'best', '--input', 'lines'], 'original');

      expect(result.code).toBe(4);
      expect(result.out).not.toContain('invented');
    }
  } finally {
    await env.close();
    provider.close();
  }
}, 15000);

test.skipIf(process.platform === 'win32')(
  'packaged pick exact, semantic ranking, and cancellation use real fzf/PTY',
  async () => {
    const { writeFile } = await import('node:fs/promises');
    const { resolve } = await import('node:path');
    const provider = mockProvider(),
      env = await sandbox(provider.config);

    try {
      await writeFile(join(env.dir, 'pick.jsonl'), '"critical checkout failure"\n"cosmetic typo"\n');
      for (const mode of ['exact', 'semantic', 'cancel']) {
        provider.reset(mode === 'semantic' ? [{ ids: ['1', '2'] }] : []);
        const args = [
          env.binary,
          'pick',
          '--stats',
          '--file',
          'pick.jsonl',
          '--input',
          'jsonl',
          '--output',
          'jsonl',
          '--query',
          'critical',
          ...(mode === 'semantic' ? ['--about', 'most urgent first'] : []),
        ];
        const p = Bun.spawn(
          ['python3', resolve('scripts/release/picker.py'), JSON.stringify(args), mode, 'critical checkout failure'],
          {
            cwd: env.dir,
            env: env.env,
            stdout: 'pipe',
            stderr: 'pipe',
          },
        );
        const result = JSON.parse(await new Response(p.stdout).text()) as { code: number; out: string; screen: string };

        expect(await p.exited, await new Response(p.stderr).text()).toBe(0);
        expect(result.code, result.screen).toBe(mode === 'cancel' ? 130 : 0);
        expect(result.out, `${mode}: ${result.screen}`).toBe(mode === 'cancel' ? '' : '"critical checkout failure"\n');
        expect(provider.requests.length).toBe(mode === 'semantic' ? 1 : 0);
        expect(parseStats(result.screen)?.requests).toBe(mode === 'semantic' ? 1 : 0);
      }
    } finally {
      await env.close();
      provider.close();
    }
  },
  20000,
);
