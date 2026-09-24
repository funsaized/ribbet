import { test, expect } from 'bun:test';
import { Budget, executeAction, z, type RecordValue } from '../../src/sdk/index.ts';
import { semanticCommands } from '../../src/builtins/semantic.ts';
import { exactCommands } from '../../src/builtins/exact.ts';

test('projection keeps annotations after classify', async () => {
  const budget = new Budget();

  try {
    const ctx = {
      budget,
      signal: budget.signal,
      log() {},
      llm: {
        async text() {
          throw new Error('Unexpected text request');
        },
        async object<T>(_prompt: string, evidence: string, schema: z.ZodType<T>) {
          return schema.parse({ reason: 'matched', label: evidence.includes('failure') ? 'relevant' : 'other' });
        },
      },
    };

    async function* records() {
      yield { id: '1', value: { body: 'failure' }, source: { path: 'ci.log' }, annotations: {} };
      yield { id: '2', value: { body: 'ok' }, source: { path: 'ci.log' }, annotations: {} };
    }

    const classified = await executeAction(
      semanticCommands.classify.actions.run,
      records(),
      { labels: 'relevant,other', field: 'body' },
      {},
      ctx,
    );
    const projected = await executeAction(exactCommands.select.actions.run, classified, { fields: 'body' }, {}, ctx);
    const rows = await Array.fromAsync(projected as AsyncIterable<RecordValue>);

    expect(rows.map((r) => (r.annotations.classify as { label: string }).label)).toEqual(['relevant', 'other']);
  } finally {
    budget.close();
  }
});
