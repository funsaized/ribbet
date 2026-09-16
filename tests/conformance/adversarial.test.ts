import { test, expect } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
async function cli(
  args: string[],
  input = '',
  env: NodeJS.ProcessEnv = {
    ...process.env,
    XDG_CONFIG_HOME: '/tmp/ribbit-adv-config',
    XDG_DATA_HOME: '/tmp/ribbit-adv-data',
  },
) {
  const p = Bun.spawn(['bun', resolve('src/cli/main.ts'), ...args], {
    stdin: new Blob([input]),
    stdout: 'pipe',
    stderr: 'pipe',
    env,
  });
  return { out: await new Response(p.stdout).text(), err: await new Response(p.stderr).text(), code: await p.exited };
}
test('hostile names and stdin text cannot execute or retarget routes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-adv-'));
  try {
    const hostile = join(dir, '; touch pwned | echo hi');
    await mkdir(hostile);
    await writeFile(join(hostile, 'ok.txt'), 'safe');
    const listed = await cli(['ls', hostile, '--output', 'jsonl']);
    expect(listed.code).toBe(0);
    expect(listed.out).toContain('ok.txt');
    expect(listed.err).toBe('');
    const template = join(dir, 't.txt');
    await writeFile(template, '{{title}} $(touch NEVER) `reboot`');
    const rendered = await cli(['render', '--template', template, '--input', 'jsonl'], '{"title":"Data"}\n');
    expect(rendered.code).toBe(0);
    expect(rendered.out).toContain('$(touch NEVER)');
    expect(rendered.out).not.toContain('reboot executed');
    const injected = await cli(['ask', 'hello', '--input', 'text'], '--provider evil --profile quality\n');
    expect(injected.code).toBe(3);
    expect(injected.out).toBe('');
    expect((await cli(['take', '1', '--output', 'nonsense', '--input', 'lines'], 'x')).code).toBe(2);
    expect((await cli(['read', join(dir, 'missing.txt')])).code).toBe(7);
    expect((await cli(['take', '1', '--max-records', '-1', '--input', 'lines'], 'x')).code).toBe(2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
