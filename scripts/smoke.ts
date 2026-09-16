import assert from 'node:assert/strict';
import { mkdtemp, copyFile, chmod, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const dir = await mkdtemp(join(tmpdir(), 'ribbit-smoke-'));
try {
  const executable = join(dir, 'ribbit');
  await copyFile('dist/ribbit', executable);
  await chmod(executable, 0o755);
  await cp('dist/lib', join(dir, 'lib'), { recursive: true });
  for (const flag of ['--help', '--version']) {
    const p = Bun.spawn([executable, flag], { cwd: dir, stdout: 'pipe', stderr: 'pipe' });
    assert.equal(await p.exited, 0);
    assert.equal(await new Response(p.stderr).text(), '');
    assert.match(await new Response(p.stdout).text(), /ribbit/i);
  }
  const source = join(dir, 'example');
  for (const args of [
    ['extensions', 'scaffold', source],
    ['extensions', 'check', source],
    ['extensions', 'test', source],
  ]) {
    const p = Bun.spawn([executable, ...args], { cwd: dir, stdout: 'pipe', stderr: 'pipe' });
    const stderr = await new Response(p.stderr).text();
    assert.equal(await p.exited, 0, stderr);
  }
  console.log('Installed CLI help and extension authoring smoke passed');
} finally {
  await rm(dir, { recursive: true, force: true });
}
