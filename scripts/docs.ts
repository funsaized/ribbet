import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : Promise.resolve([`${dir}/${e.name}`])))).flat();
}
for (const path of ['README.md', ...await walk('docs')]) {
  if (!path.endsWith('.md')) continue;
  const text = await readFile(path, 'utf8');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    if (/^(https?:|#)/.test(match[1])) continue;
    await stat(resolve(dirname(path), match[1].split('#')[0]));
  }
}
console.log('Documentation links passed');
