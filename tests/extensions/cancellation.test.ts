import { test, expect } from 'bun:test';
import { defineAction, z, Budget, RibbitError, type Context, executeAction } from '../../src/sdk/index.ts';
const config = z.strictObject({});
function context() {
  const budget = new Budget();
  const ctx: Context = {
    budget,
    signal: budget.signal,
    log() {},
    llm: {
      async text() {
        throw new Error('unexpected');
      },
      async object() {
        throw new Error('unexpected');
      },
    },
  };
  return ctx;
}
test('pending extension streams stop waiting on cancellation and request cleanup', async () => {
  const ctx = context();
  let returned = false;
  const action = defineAction({
    config,
    args: config,
    input: z.string(),
    output: z.string(),
    mode: 'text-stream',
    description: 'pending',
    capabilities: [],
    effects: [],
    execute: () => ({
      [Symbol.asyncIterator]() {
        return {
          next: () => new Promise<IteratorResult<string>>(() => {}),
          return: async () => {
            returned = true;
            return { done: true as const, value: undefined };
          },
        };
      },
    }),
  });
  try {
    const stream = (await executeAction(action, 'input', {}, {}, ctx)) as AsyncIterable<string>;
    const pending = stream[Symbol.asyncIterator]().next();
    ctx.budget.controller.abort(new RibbitError(130, 'Cancelled'));
    await expect(pending).rejects.toMatchObject({ code: 130 });
    await Promise.resolve();
    expect(returned).toBe(true);
  } finally {
    ctx.budget.close();
  }
});
test('extension exceptions are sanitized and early consumer exit closes iterators', async () => {
  const ctx = context();
  let closed = false;
  const action = defineAction({
    config,
    args: config,
    input: z.string(),
    output: z.string(),
    mode: 'text-stream',
    description: 'stream',
    capabilities: [],
    effects: [],
    execute: async function* () {
      try {
        yield 'first';
        throw new Error('PRIVATE TOKEN');
      } finally {
        closed = true;
      }
    },
  });
  try {
    const stream = (await executeAction(action, 'input', {}, {}, ctx)) as AsyncIterable<string>;
    for await (const _ of stream) break;
    expect(closed).toBe(true);
    const failed = (await executeAction(action, 'input', {}, {}, ctx)) as AsyncIterable<string>;
    await expect(Array.fromAsync(failed)).rejects.toMatchObject({
      code: 5,
      message: 'Extension stream failed (details redacted)',
    });
  } finally {
    ctx.budget.close();
  }
});
