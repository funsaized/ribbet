import { test, expect } from 'bun:test';
import { z, defineAction, defineCommand, executeAction, Budget, type Context } from '../../src/sdk/index.ts';
const config = z.strictObject({ prefix: z.string().default('') });
const action = defineAction({ config, description: 'Echo', args: z.strictObject({ times: z.number().default(1), suffix: z.string().optional() }), input: z.string(), output: z.string(), mode: 'value', capabilities: [], effects: [],
  async execute({ args, config, input }) {
    const count: number = args.times;
    // @ts-expect-error inferred numeric default is not a string
    const wrong: string = args.times;
    return config.prefix + input.repeat(count) + (args.suffix ?? '');
  }
});
const command = defineCommand({ type: '@test/echo', version: '1.0.0', description: 'Echo', config, actions: { run: action } });
function context(): Context {
  const budget = new Budget();
  return { budget, signal: budget.signal, log() {}, llm: { async text() { throw new Error('unexpected inference'); }, async object() { throw new Error('unexpected inference'); } } };
}
test('defaults and separate input/args/config validation', async () => {
  const ctx = context();
  try {
    expect(await executeAction(command.actions.run, 'x', {}, {}, ctx)).toBe('x');
    await expect(executeAction(action, 'x', { extra: 1 }, {}, ctx)).rejects.toMatchObject({ code: 2, location: 'args' });
    await expect(executeAction(action, 'x', {}, { extra: 1 }, ctx)).rejects.toMatchObject({ code: 2, location: 'config' });
    await expect(executeAction(action, 42, {}, {}, ctx)).rejects.toMatchObject({ code: 2, location: 'input' });
  } finally { ctx.budget.close(); }
});
test('output postprocessing cannot bypass validation', async () => {
  const ctx = context();
  try {
    const invalid = { ...action, async execute() { return 42 as unknown as string; } };
    await expect(executeAction(invalid, 'x', {}, {}, ctx)).rejects.toMatchObject({ code: 5, location: 'output' });
  } finally { ctx.budget.close(); }
});
test('stream validates each result and retains valid prefix only', async () => {
  const ctx = context();
  const streaming = defineAction({ config, description: 'Stream', args: z.strictObject({}), input: z.string(), output: z.string(), mode: 'text-stream', capabilities: [], effects: [],
    async *execute() { yield 'valid'; yield 42 as unknown as string; }
  });
  try {
    const result = await executeAction(streaming, '', {}, {}, ctx) as AsyncIterable<string>;
    const seen: string[] = [];
    await expect((async () => { for await (const value of result) seen.push(value); })()).rejects.toMatchObject({ code: 5 });
    expect(seen).toEqual(['valid']);
  } finally { ctx.budget.close(); }
});
