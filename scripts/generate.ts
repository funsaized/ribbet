import Ajv2020 from 'ajv/dist/2020.js';
import standalone from 'ajv/dist/standalone/index.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { builtins } from '../src/builtins/index.ts';
import { manifest, stable, hash } from '../src/sdk/manifest/index.ts';
import { sourceDigest } from '../src/extensions/install/index.ts';
await mkdir('src/generated', { recursive: true });
const sourceHash = await sourceDigest('src/builtins');
const catalog = Object.fromEntries(
  Object.entries(builtins)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([name, command]) => [name, manifest(command, sourceHash, { '@ribbit/sdk': '0.1.0', zod: '4.1.13' })]),
);
await writeFile('src/generated/catalog.json', stable(catalog) + '\n');
console.log(`Generated ${Object.keys(catalog).length} built-in manifests`);

const ajv = new Ajv2020({ allErrors: true, useDefaults: true, strict: false, code: { source: true, esm: true } });
const exports: Record<string, string> = {};
for (const command of Object.values(catalog))
  for (const action of Object.values(command.actions)) {
    const key = 'v' + hash(stable(action.args));
    if (!exports[key]) {
      ajv.addSchema(action.args, key);
      exports[key] = key;
    }
  }
await writeFile(
  'src/generated/validators.ts',
  '// @ts-nocheck\n// Generated argument validators; do not edit.\n' + standalone(ajv, exports) + '\n',
);
