import { test, expect } from 'bun:test';
// Consumer imports only the public SDK entry point, never engine internals.
import { defineAction, defineCommand, z } from '../../src/sdk/index.ts';

test('external command type composes from public exports', () => {
  const config = z.strictObject({});
  const command = defineCommand({
    type: '@consumer/length',
    version: '1.0.0',
    description: 'Length',
    config,
    actions: {
      run: defineAction({
        config,
        description: 'Length',
        args: z.strictObject({}),
        input: z.string(),
        output: z.number(),
        mode: 'value',
        capabilities: [],
        effects: [],
        execute: ({ input }) => input.length,
      }),
    },
  });

  expect(command.actions.run.execute({ input: 'hello', args: {}, config: {} }, {} as never)).toBe(5);
});
