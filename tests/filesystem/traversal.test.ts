import { test, expect } from 'bun:test';
import { mkdtemp, writeFile, mkdir, symlink, chmod, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { walk } from '../../src/filesystem/index.ts';
import { textFile } from '../../src/builtins/primitives.ts';

test('nested ignores, hidden/sensitive files and bounded content discovery', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ribbit-fs-'));
  const messages: string[] = [];

  try {
    await mkdir(join(root, 'sub'));
    await writeFile(join(root, '.gitignore'), 'ignored.txt\n');
    await writeFile(join(root, 'ignored.txt'), 'ignore');
    await writeFile(join(root, 'visible.txt'), 'hi');
    await writeFile(join(root, '.env'), 'secret');
    await writeFile(join(root, 'sub', '.gitignore'), 'hidden.txt\n');
    await writeFile(join(root, 'sub', 'hidden.txt'), 'ignore');
    await writeFile(join(root, 'sub', 'code.ts'), 'code');
    await writeFile(join(root, 'binary.bin'), new Uint8Array([0, 1]));
    await symlink(root, join(root, 'sub', 'loop'), process.platform === 'win32' ? 'junction' : 'dir');
    const rows = await walk(
      root,
      { recursive: true, follow: true, read: 'content', semantic: true, hidden: true },
      (s) => messages.push(s),
    );
    const names = rows.map((r) => (r.value as any).relativePath);

    expect(names).toContain('visible.txt');
    expect(names).toContain('sub/code.ts');
    expect(names).not.toContain('.env');
    expect(names).not.toContain('ignored.txt');
    expect(names).not.toContain('sub/hidden.txt');
    expect(names).not.toContain('binary.bin');
    const discovered = async (options: Parameters<typeof walk>[1]) =>
      (await walk(root, { recursive: true, hidden: true, noIgnore: true, ...options })).map(
        (r) => (r.value as any).relativePath,
      );

    expect(await discovered({ read: 'names' })).toContain('.env');
    expect(await discovered({ read: 'content' })).not.toContain('.env');
    expect(await discovered({ read: 'names', semantic: true })).not.toContain('.env');
    expect(await discovered({ read: 'content', includeSensitive: true })).toContain('.env');
    expect(messages.some((m) => m.includes('cycle'))).toBe(true);
    await expect(walk(root, { maxFiles: 1 })).rejects.toMatchObject({ code: 6 });
    await expect(textFile(join(root, 'binary.bin'))).rejects.toMatchObject({ code: 2 });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test.skipIf(process.platform === 'win32')('skip mode continues past unreadable nested directories', async () => {
  if (process.getuid?.() === 0) return;
  const root = await mkdtemp(join(tmpdir(), 'ribbit-skip-'));
  const locked = join(root, 'locked');
  const messages: string[] = [];

  try {
    await mkdir(locked);
    await writeFile(join(locked, 'secret.txt'), 'no');
    await writeFile(join(root, 'ok.txt'), 'yes');
    await chmod(locked, 0);
    const rows = await walk(root, { recursive: true, onReadError: 'skip' }, (s) => messages.push(s));
    const names = rows.map((r) => (r.value as any).relativePath);

    expect(names).toContain('ok.txt');
    expect(names).not.toContain('locked/secret.txt');
    expect(messages.some((m) => m.includes('unreadable'))).toBe(true);
    await expect(walk(root, { recursive: true })).rejects.toMatchObject({ code: 7 });
  } finally {
    await chmod(locked, 0o700).catch(() => {});
    await rm(root, { recursive: true, force: true });
  }
});
test('outside-root ignore links and oversized ignore files are bounded', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ribbit-ignore-'));
  const outside = await mkdtemp(join(tmpdir(), 'ribbit-ignore-out-'));

  try {
    await writeFile(join(outside, 'rules'), 'keep.txt\n');
    await writeFile(join(root, 'keep.txt'), 'x');
    await symlink(join(outside, 'rules'), join(root, '.gitignore'));
    const messages: string[] = [];
    const rows = await walk(root, {}, (s) => messages.push(s));

    expect(rows.map((r) => (r.value as any).relativePath)).toContain('keep.txt');
    expect(messages.some((m) => m.includes('outside-root ignore'))).toBe(true);
    await rm(join(root, '.gitignore'));
    await writeFile(join(root, '.gitignore'), 'a'.repeat(1024 * 1024 + 1));
    await expect(walk(root)).rejects.toMatchObject({ code: 6 });
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});
