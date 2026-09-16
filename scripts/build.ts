import { mkdir, cp, writeFile, rm } from 'node:fs/promises';
// eslint-disable-next-line import/no-unassigned-import -- intentional side effect: regenerates built-in manifests
import './generate.ts';
await mkdir('dist', { recursive: true });
const target = process.env.RIBBIT_BUILD_TARGET;
const proc = Bun.spawn(
  ['bun', 'build', 'src/cli/main.ts', '--compile', ...(target ? ['--target', target] : []), '--outfile', 'dist/ribbit'],
  { stdout: 'inherit', stderr: 'inherit' },
);
if ((await proc.exited) !== 0) process.exit(1);
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
