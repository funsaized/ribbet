import { test, expect } from 'bun:test';
import { OllamaAdapter } from '../../../src/providers/ollama/index.ts';
import { configSchema } from '../../../src/config/index.ts';
import { resolveRoute } from '../../../src/routing/index.ts';
import type { Request } from '../../../src/providers/interface/index.ts';
const route = resolveRoute(
  configSchema.parse({
    providers: { local: { type: 'ollama', baseUrl: 'http://127.0.0.1:11434', defaultModel: 'test' } },
    default: { provider: 'local' },
  }),
  {},
);
const request: Request = { route, signal: new AbortController().signal, instruction: 'Say hi', evidence: 'sample' };
test('Ollama request preserves route/schema and never pulls', async () => {
  const paths: string[] = [];
  const adapter = new OllamaAdapter(async (url, init) => {
    paths.push(String(url));
    const body = JSON.parse(String(init?.body));
    expect(body.model).toBe('test');
    expect(body.format).toEqual({ type: 'object' });
    expect(body.tools).toBeUndefined();
    return new Response(
      '{"message":{"content":"hi"},"done":false}\n{"message":{"content":""},"done":true,"done_reason":"stop","prompt_eval_count":1,"eval_count":1}\n',
    );
  });
  expect(await Array.fromAsync(adapter.stream({ ...request, schema: { type: 'object' } }))).toEqual([
    { type: 'text', text: 'hi' },
    { type: 'done', inputTokens: 1, outputTokens: 1 },
  ]);
  expect(paths).toEqual(['http://127.0.0.1:11434/api/chat']);
});
test('Ollama rejects malformed, truncated, tool and length-stop responses', async () => {
  for (const data of [
    'not json\n',
    '{"message":{"content":"hi"},"done":false}\n',
    '{"message":{"content":"","tool_calls":[{}]},"done":true}\n',
    '{"message":{"content":"partial"},"done":true,"done_reason":"length"}\n',
  ]) {
    const adapter = new OllamaAdapter(async () => new Response(data));
    await expect(Array.fromAsync(adapter.stream(request))).rejects.toMatchObject({ code: 4 });
  }
});
test('Ollama applies reasoning control only when declared, structured calls default off', async () => {
  const capable = resolveRoute(
    configSchema.parse({
      providers: {
        local: {
          type: 'ollama',
          baseUrl: 'http://127.0.0.1:11434',
          defaultModel: 'test',
          capabilities: ['text', 'reasoning'],
        },
      },
      default: { provider: 'local' },
    }),
    {},
  );
  const bodies: any[] = [];
  const adapter = new OllamaAdapter(async (_url, init) => {
    bodies.push(JSON.parse(String(init?.body)));
    return new Response(
      '{"message":{"content":"hi"},"done":false}\n{"message":{"content":""},"done":true,"done_reason":"stop"}\n',
    );
  });
  await Array.fromAsync(adapter.stream({ ...request, route: capable, schema: { type: 'object' } }));
  expect(bodies[0].think).toBe(false);
  await Array.fromAsync(
    adapter.stream({ ...request, route: { ...capable, reasoning: 'on' }, schema: { type: 'object' } }),
  );
  expect(bodies[1].think).toBe(true);
  await Array.fromAsync(adapter.stream({ ...request, route: capable }));
  expect(bodies[2].think).toBeUndefined();
  await Array.fromAsync(adapter.stream({ ...request, schema: { type: 'object' } }));
  expect(bodies[3].think).toBeUndefined();
});
test('model discovery validates response shape', async () => {
  const adapter = new OllamaAdapter(async () => Response.json({ models: [{ name: 'local:tag' }] }));
  expect(await adapter.models(route.endpoint, request.signal)).toEqual(['local:tag']);
});
