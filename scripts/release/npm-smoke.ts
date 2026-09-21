import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { prepareNpm } from './npm.ts';
import { hostTarget, binaryName, cleanEnvironment } from '../platform.ts';

const dir = await mkdtemp(join(tmpdir(), 'ribbit-npm-'));
const stage = join(dir, 'package');
const consumer = join(dir, 'consumer');
const name = '@ribbit-install-test/ribbit';
const version = JSON.parse(await readFile('package.json', 'utf8')).version;

async function run(args: string[], cwd = dir, expected = 0) {
  const child = Bun.spawn(args, {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
    stdin: 'ignore',
    env: {
      ...cleanEnvironment(dir),
      XDG_CONFIG_HOME: join(dir, 'config'),
      XDG_DATA_HOME: join(dir, 'data'),
      npm_config_cache: join(dir, 'cache'),
    },
  });
  const [out, err, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);

  assert.equal(code, expected, `${args.join(' ')}\n${err}`);

  return { out, err };
}

try {
  await prepareNpm(name, resolve('dist/releases'), stage, [hostTarget]);
  const packed = JSON.parse(
    (await run(['npm', 'pack', '--ignore-scripts', '--json', '--pack-destination', dir], stage)).out,
  )[0];

  assert.deepEqual(packed.files.map((file: any) => file.path).toSorted(), [
    'LICENSE',
    'README.md',
    'bin.cjs',
    'install.cjs',
    'package.json',
    'platforms.json',
  ]);
  await mkdir(consumer);
  await run(['npm', 'install', '--ignore-scripts', '--no-audit', '--no-fund', join(dir, packed.filename)], consumer);
  const root = join(consumer, 'node_modules', '@ribbit-install-test', 'ribbit');
  const installer = join(root, 'install.cjs');
  // No network: serve the actual native archive through the installer's fetch interface.
  const archive = resolve(`dist/releases/ribbit-${version}-${hostTarget}.tar.gz`);
  const corrupt = await run(
    [
      'node',
      '-e',
      `require(${JSON.stringify(installer)}).install(${JSON.stringify(root)}, {fetch:async()=>new Response('corrupt')}).catch(e=>{console.error(e.message);process.exitCode=1})`,
    ],
    consumer,
    1,
  );

  assert.match(corrupt.err, /checksum mismatch/);
  const preload = join(dir, 'download.cjs');

  await writeFile(
    preload,
    `globalThis.fetch=async(url)=>{if(url!==${JSON.stringify(`https://github.com/funsaized/ribbit/releases/download/v${version}/ribbit-${version}-${hostTarget}.tar.gz`)})throw Error('Unexpected download URL');return new Response(require('node:fs').readFileSync(${JSON.stringify(archive)}));};\n`,
  );
  // Exercise first-run installation when npm lifecycle scripts were disabled.
  assert.match(
    (await run(['node', '--require', preload, join(root, 'bin.cjs'), '--version'], consumer)).out,
    new RegExp(version.replaceAll('.', '\\.')),
  );
  await readFile(join(root, 'native', binaryName));
  // Exercise the actual npm bin mapping, with no network or Bun runtime dependency.
  assert.match((await run(['npm', 'exec', '--offline', '--', 'ribbit', '--version'], consumer)).out, /ribbit/);
  await run(['node', join(root, 'bin.cjs'), 'extensions', 'scaffold', 'greeting'], consumer);
  await run(['node', join(root, 'bin.cjs'), 'extensions', 'check', 'greeting'], consumer);
  await run(['node', join(root, 'bin.cjs'), 'extensions', 'test', 'greeting'], consumer);
  // A second install validates the binary and needs no network.
  await run(
    [
      'node',
      '-e',
      `require(${JSON.stringify(installer)}).install(${JSON.stringify(root)}, {fetch:()=>{throw Error('Unexpected download')}}).catch(e=>{console.error(e);process.exitCode=1})`,
    ],
    consumer,
  );
  console.log(
    'npm tarball contents, checksum rejection, first-run install, bin mapping, and extension authoring passed',
  );
} finally {
  await cleanup();
}

async function cleanup() {
  for (let attempt = 0; ; attempt++) {
    try {
      await rm(dir, { recursive: true, force: true });
      break;
    } catch (error) {
      if (process.platform !== 'win32' || attempt === 5) throw error;
      await Bun.sleep(100 * (attempt + 1));
    }
  }
}
