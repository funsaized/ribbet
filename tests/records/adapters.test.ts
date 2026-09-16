import { test, expect } from 'bun:test';
import {
  adapt,
  serialize,
  WIRE_HEADER,
  canonical,
  isJson,
  type RecordValue,
  type InputMode,
  type Limits,
} from '../../src/engine/records/index.ts';

async function* bytes(input: string | Uint8Array, split = 3) {
  const data = typeof input === 'string' ? new TextEncoder().encode(input) : input;

  for (let i = 0; i < data.length; i += split) yield data.slice(i, i + split);
}

async function consume(input: string | Uint8Array, mode: InputMode = 'auto', limits?: Limits) {
  const adapted = await adapt(bytes(input), mode, limits);

  return adapted.kind === 'text' ? adapted.value : Array.fromAsync(adapted.records);
}

const record: RecordValue = {
  id: 'one',
  value: { text: '雪\n\t\u001b[31m', number: 1 },
  annotations: { test: { label: 'a' } },
  source: { path: 'a.txt', lineStart: 2, lineEnd: 3 },
};

test('wire round trip preserves complete records with multiline UTF-8 values', async () => {
  async function* source() {
    yield record;
  }

  const wire = (await Array.fromAsync(serialize(source()))).join('');

  expect(await consume(wire)).toEqual([record]);
});
test('unterminated line, CRLF and exact literal text', async () => {
  expect(await consume('one\r\ntwo', 'lines')).toMatchObject([
    { value: 'one', id: '1' },
    { value: 'two', id: '2' },
  ]);
  expect(await consume('one\r\ntwo')).toBe('one\r\ntwo');
  expect(await consume(WIRE_HEADER, 'text')).toBe(WIRE_HEADER);
});
test('auto does not infer ordinary JSON', async () => {
  for (const input of ['{"x":1}', '[1,2]', 'null']) expect(await consume(input)).toBe(input);
});
test('explicit adapters distinguish blank line from empty stream', async () => {
  expect(await consume('', 'lines')).toEqual([]);
  expect(await consume('\n', 'lines')).toMatchObject([{ value: '' }]);
  expect(await consume(WIRE_HEADER + '\n')).toEqual([]);
  expect(await consume('')).toBe('');
  await expect(consume('', 'records')).rejects.toMatchObject({ code: 2, location: 'line 1' });
});
test('wrong headers and versions report line one', async () => {
  for (const input of [
    '{"$ribbit":{"version":2,"kind":"records"}}',
    '{"$ribbit":{"version":1,"kind":"records"},"data":1}',
    'ordinary',
  ]) {
    await expect(consume(input, 'records')).rejects.toMatchObject({ code: 2, location: 'line 1' });
  }
});
test('wire duplicate IDs, missing annotations, and bad JSON fail at record line', async () => {
  const row = JSON.stringify(record);

  await expect(consume(`${WIRE_HEADER}\n${row}\n${row}`)).rejects.toMatchObject({ code: 2, location: 'line 3' });
  await expect(consume(`${WIRE_HEADER}\n{"id":"1","value":0}`)).rejects.toMatchObject({ code: 2, location: 'line 2' });
  await expect(consume('{bad}', 'jsonl')).rejects.toMatchObject({ code: 2, location: 'line 1' });
});
test('finite JSON and source bounds enforced', async () => {
  await expect(consume('1e999', 'jsonl')).rejects.toMatchObject({ code: 2 });
  await expect(
    consume(`${WIRE_HEADER}\n${JSON.stringify({ ...record, source: { lineStart: 3, lineEnd: 1 } })}`),
  ).rejects.toMatchObject({ code: 2 });
  const cycle: unknown[] = [];

  cycle.push(cycle);
  expect(isJson(cycle)).toBe(false);
  expect(isJson(new Date())).toBe(false);
  expect(isJson([undefined])).toBe(false);
  expect(isJson({ a: Infinity })).toBe(false);
});
test('malformed and truncated UTF-8 are input errors with byte locations', async () => {
  for (const data of [new Uint8Array([0xff]), new Uint8Array([0xe9, 0x9b])]) {
    await expect(consume(data)).rejects.toMatchObject({ code: 2 });
  }
});
test('byte and record budgets fail explicitly', async () => {
  await expect(consume('12345', 'text', { maxBytes: 4, maxRecords: 10 })).rejects.toMatchObject({ code: 6 });
  await expect(consume('a\nb', 'lines', { maxBytes: 100, maxRecords: 1 })).rejects.toMatchObject({
    code: 6,
    location: 'line 2',
  });
});
test('canonical JSON sorts object keys but preserves array order', () => {
  expect(canonical({ b: 1, a: { d: 2, c: 3 } })).toBe(canonical({ a: { c: 3, d: 2 }, b: 1 }));
  expect(canonical([1, 2])).not.toBe(canonical([2, 1]));
});
test('interoperable JSONL intentionally strips metadata', async () => {
  async function* source() {
    yield record;
  }

  expect((await Array.fromAsync(serialize(source(), 'jsonl'))).join('')).toBe(JSON.stringify(record.value) + '\n');
});
test('early consumer exit closes source without draining it', async () => {
  let closed = false,
    reads = 0;

  async function* source() {
    try {
      while (true) {
        reads++;
        yield new TextEncoder().encode('a\n');
      }
    } finally {
      closed = true;
    }
  }

  const input = await adapt(source(), 'lines');

  if (input.kind !== 'records') throw new Error('Expected records');
  for await (const row of input.records) {
    expect(row.value).toBe('a');
    break;
  }
  expect(reads).toBe(1);
  expect(closed).toBe(true);
});
