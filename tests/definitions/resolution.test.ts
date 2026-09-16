import { test, expect } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { yamlFile, resolveInvocation } from '../../src/definitions/index.ts';
import { parseAction } from '../../src/cli/parser/index.ts';
test('strict YAML rejects duplicate keys and executable tags', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-yaml-'));
  try {
    const file = join(dir, 'bad.yaml');
    for (const source of ['name: a\nname: b\n', 'value: !execute hello\n']) {
      await writeFile(file, source);
      await expect(yamlFile(file)).rejects.toMatchObject({ code: 2 });
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test('named commands preserve defaults and require exact installed versions', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-definitions-'));
  try {
    await mkdir(join(dir, 'commands'));
    const file = join(dir, 'commands', 'first.yaml');
    const source =
      "apiVersion: ribbit/v1\nkind: Command\nname: first\ntype: '@ribbit/take'\ntypeVersion: '1.0.0'\naction: run\ndefaults:\n  count: 2\n";
    await writeFile(file, source);
    const invocation = await resolveInvocation('first', dir);
    expect(parseAction(['3'], invocation.manifest.actions.run, invocation.args).args.count).toBe(3);
    expect(invocation.args.count).toBe(2);
    await writeFile(file, source.replace("'1.0.0'", "'9.0.0'"));
    await expect(resolveInvocation('first', dir)).rejects.toMatchObject({ code: 3 });
    await writeFile(file, source.replace('name: first', 'name: take'));
    await expect(resolveInvocation('first', dir)).rejects.toThrow('reserved');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
