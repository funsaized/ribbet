import { test, expect } from 'bun:test';
import { CompatibleAdapter } from '../../../src/providers/openai-compatible/index.ts';
import { configSchema } from '../../../src/config/index.ts';
import { resolveRoute } from '../../../src/routing/index.ts';
import type { Request } from '../../../src/providers/interface/index.ts';

const route = resolveRoute(
  configSchema.parse({
    providers: { local: { type: 'openai-compatible', baseUrl: 'http://127.0.0.1:1234/v1', defaultModel: 'test' } },
    default: { provider: 'local' },
  }),
  {},
);
const request: Request = { route, signal: new AbortController().signal, instruction: 'Say hi', evidence: 'sample' };
const event = (delta: object, finish_reason: string | null = null) =>
  `data: ${JSON.stringify({ choices: [{ index: 0, delta, finish_reason }] })}\r\n\r\n`;

test('compatible SSE, custom base URL, structured payload, no-key local endpoint', async () => {
  const adapter = new CompatibleAdapter(async (url, init) => {
    expect(String(url)).toBe('http://127.0.0.1:1234/v1/chat/completions');
    expect((init?.headers as Record<string, string> | undefined)?.Authorization).toBeUndefined();
    expect(JSON.parse(String(init?.body)).response_format.json_schema.schema).toEqual({ type: 'object' });

    return new Response(
      event({ role: 'assistant' }) + event({ content: 'hi' }) + event({}, 'stop') + 'data: [DONE]\n\n',
    );
  });

  expect(await Array.fromAsync(adapter.stream({ ...request, schema: { type: 'object' } }))).toEqual([
    { type: 'text', text: 'hi' },
    { type: 'done' },
  ]);
});
test('compatible endpoint receives thinking control only when declared', async () => {
  const capable = resolveRoute(
    configSchema.parse({
      providers: {
        local: {
          type: 'openai-compatible',
          baseUrl: 'http://127.0.0.1:1234/v1',
          defaultModel: 'test',
          capabilities: ['text', 'object', 'reasoning'],
        },
      },
      default: { provider: 'local' },
    }),
    {},
  );
  const bodies: any[] = [];
  const adapter = new CompatibleAdapter(async (_url, init) => {
    bodies.push(JSON.parse(String(init?.body)));

    return new Response(event({ content: 'hi' }) + event({}, 'stop') + 'data: [DONE]\n\n');
  });

  await Array.fromAsync(adapter.stream({ ...request, route: capable, schema: { type: 'object' } }));
  expect(bodies[0].chat_template_kwargs).toEqual({ enable_thinking: false });
  await Array.fromAsync(
    adapter.stream({ ...request, route: { ...capable, reasoning: 'on' }, schema: { type: 'object' } }),
  );
  expect(bodies[1].chat_template_kwargs).toEqual({ enable_thinking: true });
  await Array.fromAsync(adapter.stream({ ...request, schema: { type: 'object' } }));
  expect(bodies[2].chat_template_kwargs).toBeUndefined();
});
test('SSE rejects truncation, length stop, refusal, tool call and bad JSON', async () => {
  for (const data of [
    event({ content: 'hi' }),
    event({}, 'length') + 'data: [DONE]\n\n',
    event({ refusal: 'no' }),
    event({ tool_calls: [{}] }),
    'data: {broken}\n\n',
  ]) {
    const adapter = new CompatibleAdapter(async () => new Response(data));

    await expect(Array.fromAsync(adapter.stream(request))).rejects.toMatchObject({ code: 4 });
  }
});
test('HTTP failures do not expose response bodies or authorization', async () => {
  const adapter = new CompatibleAdapter(async () => new Response('secret credential body', { status: 401 }));

  try {
    await Array.fromAsync(adapter.stream(request));
    throw new Error('expected rejection');
  } catch (error) {
    expect(String(error)).not.toContain('secret credential');
    expect((error as { status: number }).status).toBe(401);
  }
});
test('configured missing API environment key errors before fetch', async () => {
  const adapter = new CompatibleAdapter(async () => {
    throw new Error('unexpected fetch');
  });

  await expect(
    Array.fromAsync(
      adapter.stream({
        ...request,
        route: { ...route, endpoint: { ...route.endpoint, apiKeyEnv: 'RIBBIT_TEST_DEFINITELY_UNSET' } },
      }),
    ),
  ).rejects.toMatchObject({ code: 3 });
});
