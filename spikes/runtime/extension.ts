import { appendFileSync } from 'node:fs';
import { z } from 'zod';
if (process.env.RIBBIT_SPIKE_SENTINEL) appendFileSync(process.env.RIBBIT_SPIKE_SENTINEL, 'imported\n');
export const argsSchema = z.strictObject({ text: z.string(), count: z.number().int().min(1).max(100).default(1) });
export const outputSchema = z.string();
export async function* execute(args: z.infer<typeof argsSchema>, signal: AbortSignal): AsyncGenerator<string> {
  for (let i = 0; i < args.count; i++) {
    if (signal.aborted) return;
    yield outputSchema.parse(`${i}:${args.text}`);
    await new Promise<void>(resolve => {
      const abort = () => { clearTimeout(timer); resolve(); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 20);
      signal.addEventListener('abort', abort, { once: true });
    });
  }
}
