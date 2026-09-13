import assert from 'node:assert/strict';
import { mkdtemp, copyFile, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const dir = await mkdtemp(join(tmpdir(), 'ribbit-smoke-'));
try {
  const executable = join(dir, 'ribbit');
  await copyFile('dist/ribbit', executable);
  await chmod(executable, 0o755);
  for (const flag of ['--help', '--version']) {
    const p = Bun.spawn([executable, flag], { cwd: dir, stdout: 'pipe', stderr: 'pipe' });
    assert.equal(await p.exited, 0);
    assert.equal(await new Response(p.stderr).text(), '');
    assert.match(await new Response(p.stdout).text(), /ribbit/i);
  }
  console.log('Installed development CLI smoke passed');
} finally { await rm(dir, { recursive: true, force: true }); }
