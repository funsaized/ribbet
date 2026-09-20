import { test, expect } from 'bun:test';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { scaffold, testExtension } from '../../src/scaffold/index.ts';

test('nested scaffold creates parents, protects existing source and reports invalid fixtures', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-scaffold-')),
    source = join(dir, 'extensions', 'greeting');

  try {
    await scaffold(source);
    const original = await readFile(join(source, 'index.ts'), 'utf8');

    await expect(scaffold(source)).rejects.toMatchObject({ code: 2 });
    expect(await readFile(join(source, 'index.ts'), 'utf8')).toBe(original);
    expect((await testExtension(source)).failed).toBe(0);
    await writeFile(join(source, 'fixtures', 'invalid.json'), '{broken');
    const report = await testExtension(source);

    expect(report.failed).toBe(1);
    expect(report.results.find((r) => r.file === 'invalid.json')).toMatchObject({ error: 2, location: 'invalid.json' });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}, 15000);
test('agent guidance init is idempotent and preserves unrelated text', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-init-'));

  try {
    await writeFile(join(dir, 'AGENTS.md'), 'keep this\n');

    async function init() {
      const p = Bun.spawn(['bun', resolve('src/cli/main.ts'), 'init', '--agent', 'opencode'], {
        cwd: dir,
        stdout: 'pipe',
        stderr: 'pipe',
        env: { ...process.env, XDG_CONFIG_HOME: join(dir, 'cfg') },
      });

      const stderr = await new Response(p.stderr).text();

      expect({ code: await p.exited, stderr }).toEqual({ code: 0, stderr: '' });
    }

    await init();
    const first = await readFile(join(dir, 'AGENTS.md'), 'utf8');

    expect(first).toContain('keep this');
    expect(first).toContain('ribbit guidance');
    await init();
    expect(await readFile(join(dir, 'AGENTS.md'), 'utf8')).toBe(first);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
