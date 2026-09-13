import { test, expect } from 'bun:test';
import fixtures from '../../fixtures/routes/precedence.json';
import { configSchema, loadConfig } from '../../src/config/index.ts';
import { resolveRoute, inspectRoute, commandRoute } from '../../src/routing/index.ts';
const config = configSchema.parse({ providers: { local: { type: 'ollama', baseUrl: 'http://127.0.0.1:11434', defaultModel: 'local-default' }, remote: { type: 'openai-compatible', baseUrl: 'https://example.invalid/v1', defaultModel: 'remote-default', apiKeyEnv: 'SECRET' } }, profiles: { quality: { provider: 'remote', model: 'quality-model' } } });
for (const fixture of fixtures) test(fixture.name, () => {
  const result = resolveRoute(config, fixture.layers);
  expect({ provider: result.provider, model: result.model, source: result.source }).toEqual(fixture.expected);
});
test('force-profile, unknown routes and per-command names', () => {
  expect(resolveRoute(config, { cli: { provider: 'local', model: 'own' } }, 'quality').source.model).toBe('forceProfile');
  expect(() => resolveRoute(config, { cli: { profile: 'missing' } })).toThrow('Unknown profile');
  expect(() => resolveRoute(config, { cli: { model: 'missing-provider' } })).toThrow('No complete route');
  const rules = { ...config, routes: { named: { model: 'name' }, '@type/run': { model: 'type' } } };
  expect(commandRoute(rules, 'named', '@type/run')?.model).toBe('name');
});
test('inspection has no credential value or environment variable name', () => {
  const route = resolveRoute(config, { cli: { profile: 'quality' } });
  expect(JSON.stringify(inspectRoute(route))).not.toContain('SECRET');
  expect(inspectRoute(route).endpoint.authentication).toBe('environment');
});
test('capability and known-model checks happen without network', () => {
  expect(() => resolveRoute(config, { cli: { provider: 'local', temperature: 0 } })).toThrow('temperature');
  const restricted = { ...config, providers: { ...config.providers, local: { ...config.providers.local, models: ['only'] } } };
  expect(() => resolveRoute(restricted, { cli: { provider: 'local' } })).toThrow('allowlist');
});
test('unknown config keys and credential-bearing URLs rejected', () => {
  expect(() => configSchema.parse({ apiKey: 'secret' })).toThrow();
  for (const url of ['https://user:secret@example.org', 'https://example.org?key=x', 'file:///tmp/file']) expect(() => configSchema.parse({ providers: { bad: { type: 'ollama', baseUrl: url } } })).toThrow();
});
test('configuration loaders reject duplicates, unknown project fields and excessive YAML aliases', async () => {
  const { mkdtemp, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { loadProjectInference } = await import('../../src/config/index.ts');
  const dir = await mkdtemp(join(tmpdir(), 'ribbit-config-'));
  const path = join(dir, 'config.yaml');
  try {
    await writeFile(path, 'default: {}\ndefault: {}\n');
    await expect(loadConfig(path)).rejects.toMatchObject({ code: 3 });
    await writeFile(path, 'apiVersion: ribbit/v1\ninference:\n  model: local\n');
    expect(await loadProjectInference(path)).toEqual({ model: 'local' });
    await writeFile(path, 'apiVersion: ribbit/v1\nexecute: malicious\n');
    await expect(loadProjectInference(path)).rejects.toMatchObject({ code: 3 });
    await writeFile(path, 'default: &a {model: x}\nroutes:\n' + Array.from({ length: 110 }, (_, i) => `  c${i}: *a`).join('\n'));
    await expect(loadConfig(path)).rejects.toMatchObject({ code: 3 });
  } finally { await rm(dir, { recursive: true, force: true }); }
});
