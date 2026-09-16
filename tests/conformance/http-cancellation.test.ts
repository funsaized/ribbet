import { test, expect } from 'bun:test';
import { Budget } from '../../src/engine/execution/index.ts';
import { ManagedInference } from '../../src/engine/inference/index.ts';
import { OllamaAdapter } from '../../src/providers/ollama/index.ts';
import { configSchema } from '../../src/config/index.ts';
import { resolveRoute } from '../../src/routing/index.ts';

test('real loopback HTTP body is cancelled by shared execution signal', async () => {
  let cancelled = false;
  const server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    fetch() {
      return new Response(
        new ReadableStream({
          start(c) {
            c.enqueue(new TextEncoder().encode('{"message":{"content":"prefix"},"done":false}\n'));
          },
          cancel() {
            cancelled = true;
          },
        }),
        { headers: { 'Content-Type': 'application/x-ndjson' } },
      );
    },
  });
  const external = new AbortController(),
    budget = new Budget({}, external.signal);
  const route = resolveRoute(
    configSchema.parse({
      providers: { local: { type: 'ollama', baseUrl: `http://127.0.0.1:${server.port}`, defaultModel: 'test' } },
      default: { provider: 'local' },
    }),
    {},
  );
  const llm = new ManagedInference(new OllamaAdapter(), route, budget);
  const timer = setTimeout(() => external.abort(), 30);

  try {
    await expect(llm.text('test', '')).rejects.toMatchObject({ code: 130 });
    // eslint-disable-next-line no-unmodified-loop-condition -- `cancelled` is set by the aborted request
    for (let i = 0; i < 50 && !cancelled; i++) await new Promise((resolve) => setTimeout(resolve, 10));
    expect(cancelled).toBe(true);
  } finally {
    clearTimeout(timer);
    budget.close();
    server.stop(true);
  }
});
