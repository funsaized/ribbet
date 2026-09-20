import { binaryName, cleanEnvironment } from '../platform.ts';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, mkdir, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const build = JSON.parse(await readFile('dist/build.json', 'utf8'));
const name = `ribbit-${pkg.version}-${build.target}`;
const archive = resolve(`dist/releases/${name}.tar.gz`);
const digest = createHash('sha256')
  .update(await readFile(archive))
  .digest('hex');

assert.equal((await readFile(`${archive}.sha256`, 'utf8')).split(' ')[0], digest);
const dir = await mkdtemp(join(tmpdir(), 'ribbit-archive-'));

try {
  const unpack = Bun.spawn(['tar', '-xzf', archive, '-C', dir], { stdout: 'pipe', stderr: 'pipe' });

  assert.equal(await unpack.exited, 0, await new Response(unpack.stderr).text());
  const root = join(dir, name);
  const metadata = JSON.parse(await readFile(join(root, 'BUILD.json'), 'utf8'));

  assert.equal(metadata.binarySha256, build.binarySha256);
  const installed = join(dir, 'installed');

  await mkdir(installed);
  await cp(join(root, binaryName), join(installed, binaryName));
  await cp(join(root, 'lib'), join(installed, 'lib'), { recursive: true });
  // Remove the extracted source/doc tree before testing the installed runtime.
  await rm(root, { recursive: true, force: true });
  const env = {
    ...cleanEnvironment(installed),
    HOME: installed,
    XDG_CONFIG_HOME: join(installed, 'config'),
    XDG_DATA_HOME: join(installed, 'data'),
  };
  const results = [];

  for (const args of [
    ['--version'],
    ['take', '1', '--input', 'lines', '--output', 'jsonl'],
    ['extensions', 'scaffold', 'greeting'],
    ['extensions', 'check', 'greeting'],
    ['extensions', 'test', 'greeting'],
  ]) {
    const p = Bun.spawn([join(installed, binaryName), ...args], {
      cwd: installed,
      env,
      stdin: new Blob([args[0] === 'take' ? 'one\ntwo\n' : '']),
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const [out, err, code] = await Promise.all([
      new Response(p.stdout).text(),
      new Response(p.stderr).text(),
      p.exited,
    ]);

    assert.equal(code, 0, err);
    if (args[0] === 'take') assert.equal(out, '"one"\n');
    results.push({ args, code });
  }
  console.log(
    JSON.stringify(
      {
        schemaVersion: 1,
        archive: name + '.tar.gz',
        sha256: digest,
        binarySha256: build.binarySha256,
        results,
        pass: true,
      },
      null,
      2,
    ),
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
