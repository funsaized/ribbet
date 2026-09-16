import { z } from 'zod';

export class RibbitError extends Error {
  constructor(
    public code: number,
    message: string,
    public location?: string,
  ) {
    super(message);
    this.name = 'RibbitError';
  }
}
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export function isJson(value: unknown, ancestors = new Set<unknown>()): value is Json {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (!value || typeof value !== 'object' || ancestors.has(value)) return false;
  if (
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) !== Object.prototype &&
    Object.getPrototypeOf(value) !== null
  )
    return false;
  ancestors.add(value);
  const good =
    (Array.isArray(value) ? Array.from(value) : Object.values(value)).every((v) => isJson(v, ancestors)) &&
    Object.getOwnPropertySymbols(value).length === 0;
  ancestors.delete(value);
  return good;
}
export const jsonValueSchema = z
  .unknown()
  .meta({ ribbitJson: true, description: 'Finite JSON; execution validates recursively.' });
export const recordSchema = z.strictObject({
  id: z.string().min(1),
  value: jsonValueSchema,
  source: z
    .strictObject({
      path: z.string().optional(),
      lineStart: z.number().int().positive().optional(),
      lineEnd: z.number().int().positive().optional(),
    })
    .optional(),
  annotations: z.record(z.string(), jsonValueSchema).meta({ ribbitDictionary: true }),
});
export type RecordValue = Omit<z.infer<typeof recordSchema>, 'value' | 'annotations'> & {
  value: Json;
  annotations: Record<string, Json>;
};
export const WIRE_HEADER = '{"$ribbit":{"version":1,"kind":"records"}}';
export type InputMode = 'auto' | 'text' | 'lines' | 'jsonl' | 'records';
export type Input = { kind: 'text'; value: string } | { kind: 'records'; records: AsyncIterable<RecordValue> };
export type Limits = { maxBytes: number; maxRecords: number };
export const EXACT_LIMITS: Limits = { maxBytes: 128 * 1024 * 1024, maxRecords: 1_000_000 };
export const SEMANTIC_LIMITS: Limits = { maxBytes: 8 * 1024 * 1024, maxRecords: 10_000 };

export function validateRecord(value: unknown, location?: string): RecordValue {
  if (!isJson(value)) throw new RibbitError(2, 'Record must contain only finite JSON values', location);
  const parsed = recordSchema.safeParse(value);
  if (!parsed.success) throw new RibbitError(2, `Invalid record: ${parsed.error.message}`, location);
  if (
    parsed.data.source?.lineStart !== undefined &&
    parsed.data.source?.lineEnd !== undefined &&
    parsed.data.source.lineStart > parsed.data.source.lineEnd
  )
    throw new RibbitError(2, 'Invalid source line range', location);
  // Return original to preserve exact supplied values and identity, after validation.
  return value as RecordValue;
}
export function canonical(value: Json): string {
  if (!isJson(value)) throw new RibbitError(2, 'Expected finite JSON value');
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object')
    return `{${Object.keys(value)
      .toSorted()
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(',')}}`;
  return JSON.stringify(value);
}
function parseJson(line: string, location: string): Json {
  try {
    const value: unknown = JSON.parse(line);
    if (!isJson(value)) throw new Error('non-finite value');
    return value;
  } catch {
    throw new RibbitError(2, 'Malformed JSON or non-finite value', location);
  }
}
export function header(line: string): boolean {
  let value: unknown;
  try {
    value = JSON.parse(line);
  } catch {
    return false;
  }
  if (!value || typeof value !== 'object' || !Object.hasOwn(value, '$ribbit')) return false;
  if (canonical(value as Json) !== canonical(JSON.parse(WIRE_HEADER)))
    throw new RibbitError(2, 'Invalid Ribbit wire header or version', 'line 1');
  return true;
}
// Fatal decoding rejects malformed UTF-8, including trailing incomplete sequences.
async function* decoded(source: AsyncIterable<Uint8Array>, limit: number): AsyncGenerator<string> {
  const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
  let bytes = 0;
  try {
    for await (const chunk of source) {
      bytes += chunk.byteLength;
      if (bytes > limit) throw new RibbitError(6, `Input exceeds ${limit} bytes`, `byte ${bytes}`);
      try {
        yield decoder.decode(chunk, { stream: true });
      } catch {
        throw new RibbitError(2, 'Malformed UTF-8', `byte ${bytes - chunk.byteLength + 1}..${bytes}`);
      }
    }
    try {
      const tail = decoder.decode();
      if (tail) yield tail;
    } catch {
      throw new RibbitError(2, 'Incomplete UTF-8 sequence', `byte ${bytes}`);
    }
  } catch (error) {
    if (error instanceof RibbitError) throw error;
    throw new RibbitError(7, `Input read failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
async function* lines(source: AsyncIterable<string>): AsyncGenerator<{ text: string; ending: string }> {
  let pending = '';
  for await (const chunk of source) {
    pending += chunk;
    let end: number;
    while ((end = pending.indexOf('\n')) !== -1) {
      const crlf = end > 0 && pending[end - 1] === '\r';
      yield { text: pending.slice(0, crlf ? end - 1 : end), ending: crlf ? '\r\n' : '\n' };
      pending = pending.slice(end + 1);
    }
  }
  if (pending) yield { text: pending, ending: '' };
}
export async function adapt(
  source: AsyncIterable<Uint8Array>,
  mode: InputMode = 'auto',
  limits = SEMANTIC_LIMITS,
  path?: string,
): Promise<Input> {
  if (
    !Number.isSafeInteger(limits.maxBytes) ||
    limits.maxBytes < 0 ||
    !Number.isSafeInteger(limits.maxRecords) ||
    limits.maxRecords < 0
  )
    throw new RibbitError(2, 'Invalid input limits');
  if (!['auto', 'text', 'lines', 'jsonl', 'records'].includes(mode)) throw new RibbitError(2, 'Unknown input mode');
  if (mode === 'text') {
    let value = '';
    for await (const chunk of decoded(source, limits.maxBytes)) value += chunk;
    return { kind: 'text', value };
  }
  const iterator = lines(decoded(source, limits.maxBytes))[Symbol.asyncIterator]();
  let first: IteratorResult<{ text: string; ending: string }>;
  try {
    first = await iterator.next();
  } catch (e) {
    await iterator.return?.(undefined);
    throw e;
  }
  let wire = false;
  try {
    wire = mode === 'records' || (mode === 'auto' && !first.done && header(first.value.text));
    if (mode === 'records' && (first.done || !header(first.value.text)))
      throw new RibbitError(2, 'Expected Ribbit wire header', 'line 1');
    if (mode === 'auto' && !wire) {
      let value = first.done ? '' : first.value.text + first.value.ending;
      for (let part = await iterator.next(); !part.done; part = await iterator.next())
        value += part.value.text + part.value.ending;
      return { kind: 'text', value };
    }
  } catch (error) {
    await iterator.return?.(undefined);
    throw error;
  }
  return {
    kind: 'records',
    records: (async function* () {
      const ids = new Set<string>();
      let count = 0,
        lineNumber = wire ? 1 : 0;
      try {
        let item = wire ? await iterator.next() : first;
        while (!item.done) {
          lineNumber++;
          count++;
          if (count > limits.maxRecords)
            throw new RibbitError(6, `Input exceeds ${limits.maxRecords} records`, `line ${lineNumber}`);
          const location = `line ${lineNumber}`;
          const record = wire
            ? validateRecord(parseJson(item.value.text, location), location)
            : {
                id: String(count),
                value: mode === 'lines' ? item.value.text : parseJson(item.value.text, location),
                source: { ...(path ? { path } : {}), lineStart: lineNumber, lineEnd: lineNumber },
                annotations: {},
              };
          if (ids.has(record.id)) throw new RibbitError(2, `Duplicate record ID: ${record.id}`, location);
          ids.add(record.id);
          yield record;
          item = await iterator.next();
        }
      } finally {
        await iterator.return?.(undefined);
      }
    })(),
  };
}
export async function* serialize(
  records: AsyncIterable<RecordValue>,
  mode: 'records' | 'jsonl' = 'records',
): AsyncGenerator<string> {
  if (mode === 'records') yield WIRE_HEADER + '\n';
  const ids = new Set<string>();
  for await (const record of records) {
    validateRecord(record);
    if (ids.has(record.id)) throw new RibbitError(2, `Duplicate record ID: ${record.id}`);
    ids.add(record.id);
    yield JSON.stringify(mode === 'records' ? record : record.value) + '\n';
  }
}
