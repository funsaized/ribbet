import { test, expect } from 'bun:test';
import { Budget, take, validated, writeOutput } from '../../src/engine/execution/index.ts';
test('take zero never starts source and positive take closes without extra pull', async () => {
  let reads = 0, closed = false;
  async function* source() { try { while (true) { reads++; yield reads; } } finally { closed = true; } }
  expect(await Array.fromAsync(take(source(), 0))).toEqual([]);
  expect(reads).toBe(0);
  expect(await Array.fromAsync(take(source(), 3))).toEqual([1, 2, 3]);
  expect(reads).toBe(3); expect(closed).toBe(true);
});
test('all attempts share a finite request budget', async () => {
  const budget = new Budget({ maxRequests: 2 });
  try {
    await budget.request(async () => 'first'); await budget.request(async () => 'repair');
    await expect(budget.request(async () => 'third')).rejects.toMatchObject({ code: 6 });
    expect(budget.requests).toBe(2);
  } finally { budget.close(); }
});
test('request deadline rejects even a noncooperative provider and signals it', async () => {
  const budget = new Budget({ requestMs: 10 });
  let signal: AbortSignal | undefined;
  try {
    await expect(budget.request(s => { signal = s; return new Promise(() => {}); })).rejects.toMatchObject({ code: 6 });
    expect(signal?.aborted).toBe(true);
  } finally { budget.close(); }
});
test('external cancellation aborts provider and reports 130', async () => {
  const external = new AbortController(); const budget = new Budget({}, external.signal);
  let signal: AbortSignal | undefined;
  const running = budget.request(s => { signal = s; return new Promise(() => {}); });
  await Promise.resolve(); external.abort();
  try { await expect(running).rejects.toMatchObject({ code: 130 }); expect(signal?.aborted).toBe(true); }
  finally { budget.close(); }
});
test('total time and bytes/tokens enforce bounds', async () => {
  const budget = new Budget({ totalMs: 10, maxBytes: 2, maxTokens: 2 });
  try {
    expect(() => budget.charge('bytes', 3)).toThrow('budget exceeded');
    expect(() => budget.charge('tokens', 3)).toThrow('budget exceeded');
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(() => budget.check()).toThrow('deadline');
  } finally { budget.close(); }
});
test('invalid result never emits and output limit closes upstream', async () => {
  const budget = new Budget({ maxRecords: 1 });
  let closed = false;
  async function* source() { try { yield { id: '1', value: 'a', annotations: {} }; yield { id: '2', value: 'b', annotations: {} }; } finally { closed = true; } }
  const seen: string[] = [];
  try {
    await expect((async () => { for await (const r of validated(source(), budget)) seen.push(r.id); })()).rejects.toMatchObject({ code: 6 });
    expect(seen).toEqual(['1']); expect(closed).toBe(true);
  } finally { budget.close(); }
});
test('pipe closure succeeds only for expected downstream EPIPE; writer backpressure is awaited', async () => {
  let closed = false, produced = 0;
  async function* source() { try { produced++; yield 'a'; produced++; yield 'b'; } finally { closed = true; } }
  await writeOutput(source(), { async write() { expect(produced).toBe(1); throw Object.assign(new Error('closed'), { code: 'EPIPE' }); } }, true);
  expect(closed).toBe(true); expect(produced).toBe(1);
  await expect(writeOutput(source(), { async write() { throw Object.assign(new Error('closed'), { code: 'EPIPE' }); } }, false)).rejects.toMatchObject({ code: 7 });
});
