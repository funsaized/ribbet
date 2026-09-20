import { readFile, readdir, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));

await mkdir('docs/third-party', { recursive: true });
const lines = [
  '# Third-party notices',
  '',
  'Inventory of installed locked dependencies, including development tools and SDK support files. This inventory does not select a license for Ribbit. Model weights and fzf are not bundled. The installed Bun runtime notice is preserved in [bun-1.4.0.txt](docs/third-party/bun-1.4.0.txt), including linked-library notices. TypeScript additional notices are preserved in [typescript-third-party.txt](docs/third-party/typescript-third-party.txt). Publication requires distribution compliance review; see the release checklist.',
  '',
  '| Package | Version | Declared license | License text |',
  '| --- | --- | --- | --- |',
];

for (const [path, metadata] of Object.entries(lock.packages) as [string, any][]) {
  if (!path || !path.startsWith('node_modules/')) continue;
  let pkg, files;

  try {
    pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'));
    files = await readdir(path);
  } catch {
    continue;
  }
  const license = files.find((f) => /^(licen[sc]e|copying)([._-].*)?$/i.test(f));
  let link = 'No top-level license text found';

  if (license) {
    const name = `${pkg.name.replace(/[^a-zA-Z0-9_-]/g, '_')}-${pkg.version}.txt`;

    await copyFile(join(path, license), join('docs/third-party', name));
    link = `[text](docs/third-party/${name})`;
  }
  lines.push(
    `| ${pkg.name} | ${pkg.version} | ${typeof pkg.license === 'string' ? pkg.license : (metadata.license ?? 'Unspecified')} | ${link} |`,
  );
}
await writeFile('THIRD_PARTY_NOTICES.md', lines.join('\n') + '\n');

await copyFile('node_modules/typescript/ThirdPartyNoticeText.txt', 'docs/third-party/typescript-third-party.txt');
