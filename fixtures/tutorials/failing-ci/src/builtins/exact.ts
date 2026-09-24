import {
  z,
  defineCommand,
  defineAction,
  jsonValueSchema,
  recordSchema,
  RibbitError,
  type Action,
  type RecordValue,
} from '../sdk/index.ts';
import { canonical, type Json } from '../engine/records/index.ts';
import { take as takeStream } from '../engine/execution/index.ts';
import { field, pathParts, recordField, recordPathParts, collect, textFile } from './primitives.ts';

const config = z.strictObject({});

function recordCommand(
  name: string,
  description: string,
  args: z.ZodType,
  execute: Action['execute'],
  options: Partial<Action> = {},
) {
  return defineCommand({
    type: `@ribbit/${name}`,
    version: '1.0.0',
    description,
    config,
    actions: {
      run: defineAction({
        config,
        description,
        args,
        input: recordSchema,
        output: recordSchema,
        mode: 'records',
        inputKind: 'records',
        outputKind: 'records',
        capabilities: [],
        effects: [],
        barrier: false,
        execute,
        ...options,
      } as Action),
    },
  });
}

function assign(root: any, path: string, value: Json) {
  const parts = pathParts(path);
  let current = root;

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];

    if (Array.isArray(current) && typeof p === 'number') while (current.length <= p) current.push(null);
    if (i === parts.length - 1) {
      current[p] = structuredClone(value);

      return;
    }
    if (current[p] === null || typeof current[p] !== 'object') current[p] = typeof parts[i + 1] === 'number' ? [] : {};
    current = current[p];
  }
}

export const exactCommands = {
  select: recordCommand(
    'select',
    'Project selected value fields, preserving IDs',
    z.strictObject({ fields: z.string().min(1), missing: z.enum(['error', 'null']).default('error') }),
    async function* ({ args, input }, ctx) {
      const a = args as any,
        paths = a.fields.split(',').map((token: string) => {
          const sides = token.trim().split('=').map((side) => side.trim());
          if (sides.length > 2 || sides.some((side) => !side)) throw new RibbitError(2, 'Invalid projection');
          const [destination, source] = sides.length === 2 ? sides : [sides[0], sides[0]];
          const parts = pathParts(destination);
          recordPathParts(source);
          if (sides.length === 1 && source.startsWith('$')) throw new RibbitError(2, 'Envelope source needs an alias');
          return { destination, source, parts };
        });

      for (const [i, p] of paths.entries()) for (const other of paths.slice(0, i)) {
        const common = p.parts.every((part: string | number, j: number) => other.parts[j] === part) ||
          other.parts.every((part: string | number, j: number) => p.parts[j] === part);
        const containerConflict = p.parts.some((part: string | number, j: number) =>
          j > 0 && other.parts.length > j &&
          p.parts.slice(0, j).every((prefix: string | number, k: number) => other.parts[k] === prefix) &&
          typeof part !== typeof other.parts[j]);
        if (common || containerConflict) throw new RibbitError(2, 'Conflicting projection destinations');
      }
      for await (const r of input as AsyncIterable<RecordValue>) {
        const value = {};

        for (const { destination, source } of paths) {
          assign(value, destination, recordField(r, source, a.missing));
          if (Buffer.byteLength(JSON.stringify(value)) > ctx.budget.limits.maxBytes)
            throw new RibbitError(6, 'Projection exceeds byte limit');
        }
        yield { id: r.id, value };
      }
    },
    { cli: { positionals: ['fields'] } },
  ),
