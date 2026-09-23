import { test, expect } from 'bun:test';
import { z } from 'zod';
import { Budget } from '../../src/engine/execution/index.ts';
import { ManagedInference, schemaToJson } from '../../src/engine/inference/index.ts';
import { type Adapter, TransportError } from '../../src/providers/interface/index.ts';
import { configSchema } from '../../src/config/index.ts';
import { resolveRoute } from '../../src/routing/index.ts';

const config = configSchema.parse({
  providers: {
    local: {
      type: 'ollama',
      baseUrl: 'http://127.0.0.1:11434',
      defaultModel: 'test',
      capabilities: ['text', 'object', 'stream'],
    },
  },
  default: { provider: 'local' },
});
const route = resolveRoute(config, {});

test('structured repair is bounded and usage remains unknown when omitted', async () => {
  let calls = 0;
  const adapter: Adapter = {
    async *stream() {
      yield { type: 'text', text: ++calls === 1 ? 'not JSON' : '{"ok":true}' };
      yield { type: 'done' };
    },
  };
  const budget = new Budget();
  const llm = new ManagedInference(adapter, route, budget);

  try {
    expect(await llm.object('extract', 'evidence', z.strictObject({ ok: z.boolean() }))).toEqual({ ok: true });
    expect(llm.repairs).toBe(1);
    expect(budget.requests).toBe(2);
    expect(budget.usageUnknown).toBe(true);
  } finally {
    budget.close();
  }
});
test('unsupported refinements and transforms fail before transport', () => {
  expect(() => schemaToJson(z.string().refine((x) => x === 'x'))).toThrow('refinements');
  expect(() => schemaToJson(z.string().transform((x) => x.length))).toThrow('Unsupported');
  expect(() => schemaToJson(z.object({ x: z.string() }))).toThrow('strict');
});
test('truncation fails, schema failures stop after one repair', async () => {
  for (const truncate of [true, false]) {
    const adapter: Adapter = {
      async *stream() {
        yield { type: 'text', text: 'bad' };
        if (!truncate) yield { type: 'done' };
      },
    };
    const budget = new Budget();
    const llm = new ManagedInference(adapter, route, budget);

    try {
      await expect(llm.object('extract', 'evidence', z.strictObject({ ok: z.boolean() }))).rejects.toMatchObject({
        code: 4,
      });
      expect(budget.requests).toBe(truncate ? 1 : 2);
    } finally {
      budget.close();
    }
  }
});
test('bounded retry shares request budget and never switches route', async () => {
  let calls = 0;
  const adapter: Adapter = {
    async *stream(request) {
      expect(request.route).toBe(route);
      if (++calls === 1) throw new TransportError(503);
      yield { type: 'text', text: 'ok' };
      yield { type: 'done', inputTokens: 2, outputTokens: 1 };
    },
  };
  const budget = new Budget();
  const llm = new ManagedInference(adapter, route, budget);

  try {
    expect(await llm.text('ask', '')).toBe('ok');
    expect(budget.requests).toBe(2);
    expect(budget.tokens).toBe(3);
    expect(llm.retries).toBe(1);
  } finally {
    budget.close();
  }
});
