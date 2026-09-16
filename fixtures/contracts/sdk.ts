import { z } from '../../spikes/runtime/node_modules/zod/index.js';
export interface Budget { request(): void; tokens(count: number): void; }
export interface Context {
  signal: AbortSignal;
  budget: Budget;
  log(message: string): void;
  llm: {
    text(instruction: string, evidence: string): Promise<string>;
    object<T>(instruction: string, evidence: string, schema: z.ZodType<T>): Promise<T>;
  };
}
export function defineCommand<C extends z.ZodType, A extends z.ZodType, I extends z.ZodType, O extends z.ZodType>(spec: {
  type: string; version: string; description: string; config: C;
  actions: { run: {
    description: string; args: A; input: I; output: O;
    mode: 'value'; capabilities: string[]; effects: string[];
    execute(input: { config: z.output<C>; args: z.output<A>; input: z.output<I> }, ctx: Context): Promise<z.output<O>>;
  } };
}) { return spec; }
const consumer = defineCommand({
  type: '@test/echo', version: '1.0.0', description: 'Echo', config: z.strictObject({ prefix: z.string().default('') }),
  actions: { run: {
    description: 'Echo a value', args: z.strictObject({ count: z.number().default(1), suffix: z.string().optional() }),
    input: z.string(), output: z.string(), mode: 'value', capabilities: [], effects: [],
    async execute({ input, config, args }) {
      const count: number = args.count;
      const suffix: string | undefined = args.suffix;
      // @ts-expect-error defaults are numbers, never string
      const _invalid: string = args.count;
      return `${config.prefix}${input.repeat(count)}${suffix ?? ''}`;
    }
  } }
});
void consumer;
