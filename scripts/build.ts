import { hostTarget } from './platform.ts';
import { createHash } from 'node:crypto';
import { sourceDigest } from '../src/extensions/install/index.ts';
import { mkdir, cp, writeFile, rm, readFile } from 'node:fs/promises';
// eslint-disable-next-line import/no-unassigned-import -- intentional side effect: regenerates built-in manifests
import './generate.ts';

await mkdir('dist', { recursive: true });
const target = process.env.RIBBIT_BUILD_TARGET;
const targetName = target?.replace(/^bun-/, '') ?? hostTarget;
const executable = targetName.startsWith('windows-') ? 'ribbit.exe' : 'ribbit';
const proc = Bun.spawn(
  [
    'bun',
    'build',
    'src/cli/main.ts',
    '--compile',
    '--define',
    'RIBBIT_COMPILED=true',
    ...(target ? ['--target', target] : []),
    '--outfile',
    `dist/${executable}`,
  ],
  { stdout: 'inherit', stderr: 'inherit' },
);

if ((await proc.exited) !== 0) process.exit(1);
if (process.platform === 'darwin' && targetName.startsWith('darwin-')) {
  const sign = Bun.spawn(['codesign', '--force', '--sign', '-', `dist/${executable}`], {
    stdout: 'inherit',
    stderr: 'inherit',
  });

  if ((await sign.exited) !== 0) throw new Error('Ad-hoc signing failed');
}
await rm('dist/lib', { recursive: true, force: true });
for (const path of [
  'src/sdk',
  'src/engine/records',
  'src/engine/execution',
  'node_modules/zod',
  'node_modules/typescript',
  'node_modules/@types',
  'node_modules/bun-types',
  'node_modules/undici-types',
])
  await cp(path, `dist/lib/${path}`, { recursive: true });
await writeFile(
  'dist/lib/package.json',
  JSON.stringify(
    {
      name: '@ribbit/sdk',
      version: '0.1.0',
      private: true,
      type: 'module',
      exports: { '.': './src/sdk/index.ts' },
      dependencies: { zod: '4.1.13' },
    },
    null,
    2,
  ) + '\n',
);
console.log('Built CLI with local SDK and extension compiler type support');

await writeFile(
  'dist/build.json',
  JSON.stringify(
    {
      schemaVersion: 1,
      target: targetName,
      executable,
      runtime: Bun.version,
      sourceSha256: await sourceDigest('src'),
      lockSha256: createHash('sha256')
        .update(await readFile('package-lock.json'))
        .digest('hex'),
      binarySha256: createHash('sha256')
        .update(await readFile(`dist/${executable}`))
        .digest('hex'),
    },
    null,
    2,
  ) + '\n',
);
