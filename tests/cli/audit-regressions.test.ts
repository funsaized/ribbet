import { test, expect } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
async function cli(args: string[], input = '', opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  const p = Bun.spawn(['bun', resolve('src/cli/main.ts'), ...args], {
    cwd: opts.cwd,
    stdin: new Blob([input]),
    stdout: 'pipe',
    stderr: 'pipe',
    env: opts.env ?? process.env,
  });
  return { out: await new Response(p.stdout).text(), err: await new Response(p.stderr).text(), code: await p.exited };
}
test('take zero does not discard input referenced by a later flow step', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-zero-flow-'));
  try {
    const path = join(dir, 'flow.yaml');
    await writeFile(
      path,
      'apiVersion: ribbit/v1\nkind: Flow\nname: reuse\nsteps:\n  - id: empty\n    command: take\n    args: {count: 0}\n  - id: first\n    command: take\n    args: {count: 1}\n    input: {$ref: input}\n',
    );
    expect(await cli(['flow', 'run', path, '--input', 'lines', '--output', 'jsonl'], 'A\nB\n')).toEqual({
      code: 0,
      out: '"A"\n',
      err: '',
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test('flow flags preflight and management JSON errors are consistent', async () => {
  expect((await cli(['flow', 'run', '--output', 'nonsense', '--', 'read', '/does-not-exist'])).code).toBe(2);
  expect((await cli(['flow', 'plan', '--max-records', '-1', '--', 'take', '1'])).code).toBe(2);
  expect((await cli(['types', 'describe', '@ribbit/take', '--error-format', 'json'])).code).toBe(0);
  const plan = await cli(['flow', 'plan', '--max-records', '3', '--', 'take', '1']);
  expect(JSON.parse(plan.out).limits.maxRecords).toBe(3);
  expect((await cli(['flow', 'validate', '--', 'take', '1'])).code).toBe(0);
});
test('completions and named help include definitions, runtime flags and defaults', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-complete-'));
  const env = { ...process.env, XDG_CONFIG_HOME: join(dir, 'cfg'), XDG_DATA_HOME: join(dir, 'data') };
  try {
    await mkdir(join(dir, 'commands'));
    await writeFile(
      join(dir, 'commands', 'first.yaml'),
      "apiVersion: ribbit/v1\nkind: Command\nname: first\ntype: '@ribbit/take'\ntypeVersion: '1.0.0'\naction: run\ndefaults:\n  count: 2\n",
    );
    const bash = await cli(['completions', 'bash'], '', { cwd: dir, env });
    expect(bash.code).toBe(0);
    expect(bash.out).toContain('first');
    expect(bash.out).toContain('--input');
    expect(bash.out).toContain('--error-format');
    const named = await cli(['first', '--help'], '', { cwd: dir, env });
    expect(named.code).toBe(0);
    expect(named.out).toContain('@ribbit/take');
    expect(named.out).toContain('Action: run');
    expect(named.out).toContain('"count":2');
    expect((await cli(['flow', '--help'])).out).toContain('validate');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test('stdin and --file cannot both supply data; setup does not download', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-io-'));
  const env = { ...process.env, XDG_CONFIG_HOME: join(dir, 'cfg'), XDG_DATA_HOME: join(dir, 'data') };
  try {
    const file = join(dir, 'in.txt');
    await writeFile(file, 'hello');
    expect((await cli(['take', '1', '--file', file, '--input', 'lines'], 'also', { env })).code).toBe(2);
    const setup = await cli(['setup', '--json'], '', { env });
    expect(setup.code).toBe(0);
    expect(JSON.parse(setup.out).downloadPerformed).toBe(false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
