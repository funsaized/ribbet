import { test, expect } from 'bun:test';
import { responseLines } from '../../src/providers/http/index.ts';
test('response parser handles arbitrary UTF-8 chunk boundaries and rejects malformed encoding', async () => {
  const input = new TextEncoder().encode('雪\nnext');
  const response = new Response(
    new ReadableStream({
      start(controller) {
        for (const byte of input) controller.enqueue(new Uint8Array([byte]));
        controller.close();
      },
    }),
  );
  expect(await Array.fromAsync(responseLines(response, new AbortController().signal))).toEqual(['雪', 'next']);
  await expect(
    Array.fromAsync(responseLines(new Response(new Uint8Array([255])), new AbortController().signal)),
  ).rejects.toMatchObject({ code: 4 });
});
test('response parser enforces byte bound and cancels reader on consumer exit', async () => {
  await expect(
    Array.fromAsync(responseLines(new Response('12345'), new AbortController().signal, 4)),
  ).rejects.toMatchObject({ code: 6 });
  let cancelled = false;
  const response = new Response(
    new ReadableStream({
      start(c) {
        c.enqueue(new TextEncoder().encode('a\n'));
      },
      cancel() {
        cancelled = true;
      },
    }),
  );
  for await (const line of responseLines(response, new AbortController().signal)) {
    expect(line).toBe('a');
    break;
  }
  expect(cancelled).toBe(true);
});
