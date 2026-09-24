import { test, expect } from 'bun:test';
import { cp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { sandbox, mockProvider } from '../../scripts/release/harness.ts';

test('packaged management lifecycle and discovery', async () => {
  const provider = mockProvider(),
    env = await sandbox(provider.config);
  const invoke = async (args: string[]) => {
    const result = await env.run([...args, '--json']);

    expect(result.code, result.err).toBe(0);
    const value = JSON.parse(result.out);

    expect(value.schemaVersion).toBe(1);

    return value;
  };

  try {
    expect((await invoke(['commands', 'list'])).commands.length).toBe(23);
    for (const name of (await invoke(['commands', 'list'])).commands) {
      expect((await invoke(['commands', 'describe', name])).valid).toBe(true);
      expect((await env.run([name, '--help'])).out).toContain('Input:');
    }
    expect((await invoke(['types', 'list'])).types.length).toBe(23);
    expect((await invoke(['types', 'describe', '@ribbit/filter'])).type.type).toBe('@ribbit/filter');
    expect((await invoke(['route', 'inspect', 'ask', '--profile', 'stronger'])).model).toBe('strong');
    expect((await invoke(['route', 'inspect', 'take'])).inference).toBe(false);
    expect((await invoke(['models', 'list', '--provider', 'mock'])).models).toEqual(['small', 'strong']);
    expect((await invoke(['doctor', '--probe'])).checks.every((c: any) => c.ok)).toBe(true);
    expect((await invoke(['setup'])).downloadPerformed).toBe(false);
    await invoke([
      'providers',
      'add',
      'temporary',
      '--type',
      'openai-compatible',
      '--base-url',
      provider.config.providers.mock.baseUrl,
    ]);
    expect((await invoke(['providers', 'list'])).providers.temporary).toBeDefined();
    await invoke(['profiles', 'set', 'temporary', '--provider', 'temporary', '--model', 'small']);
    expect((await invoke(['profiles', 'show', 'temporary'])).profile.model).toBe('small');
    expect((await invoke(['profiles', 'list'])).profiles.temporary).toBeDefined();
    expect((await env.run(['providers', 'remove', 'temporary'])).code).toBe(3);
    await invoke(['profiles', 'remove', 'temporary']);
    await invoke(['providers', 'remove', 'temporary']);
    await writeFile(join(env.dir, 'AGENTS.md'), 'Existing owner guidance.\n');
    await invoke(['init', '--agent', 'codex']);
    const guidance = await readFile(join(env.dir, 'AGENTS.md'), 'utf8');

    await invoke(['init', '--agent', 'codex']);
    expect(await readFile(join(env.dir, 'AGENTS.md'), 'utf8')).toBe(guidance);
    expect(guidance).toContain('Existing owner guidance.');
    await mkdir(join(env.dir, 'commands'));
    await cp('examples/commands/brief.yaml', join(env.dir, 'commands/brief.yaml'));
    expect((await invoke(['commands', 'validate', 'brief'])).valid).toBe(true);
    for (const shell of ['bash', 'zsh', 'fish']) expect((await env.run(['completions', shell])).out).toContain('brief');
    provider.reset(['Mina owns the fix.']);
    const named = await env.run(['run', 'brief', '--words', '10'], 'Mina owns the fix.');

    expect(named.code, named.err).toBe(0);
    expect(named.out.trim()).toBe('Mina owns the fix.');
    expect(provider.requests[0].messages[0].content).toContain('10');
    const extension = join(env.dir, 'greeting');

    await invoke(['extensions', 'scaffold', extension]);
    await invoke(['extensions', 'check', extension]);
    expect((await invoke(['extensions', 'test', extension])).failed).toBe(0);
    await invoke(['extensions', 'add', extension]);
    expect((await invoke(['extensions', 'list'])).extensions.length).toBe(1);
    await invoke(['extensions', 'remove', '@local/greeting']);
    expect((await invoke(['extensions', 'list'])).extensions).toEqual([]);
    expect(await readFile(join(extension, 'index.ts'), 'utf8')).toContain('defineCommand');
  } finally {
    await env.close();
    provider.close();
  }
}, 30000);
