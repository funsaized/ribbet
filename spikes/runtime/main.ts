import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const [action, rootArg, text = 'hello', count = '1'] = process.argv.slice(2);
const root = resolve(rootArg ?? '.');
const signal = new AbortController();
process.on('SIGINT', () => { signal.abort(); process.exitCode = 130; });
// Discovery exits before the dynamic import: installed executable code stays dormant.
if (action === 'describe') {
  console.log(readFileSync(resolve(root, 'manifest.json'), 'utf8'));
} else if (action === '--version') {
  console.log('ribbit-runtime-spike 0.0.0');
} else if (action === 'check' || action === 'run') {
  const extension = await import(pathToFileURL(resolve(root, 'extension.mjs')).href);
  if (action === 'check') {
    // Export happens only during an explicit check/build.
    const { z } = await import('zod');
    writeFileSync(resolve(root, 'manifest.json'), JSON.stringify({ schemaVersion: 1,
      type: '@spike/echo', args: z.toJSONSchema(extension.argsSchema), output: z.toJSONSchema(extension.outputSchema) }) + '\n');
  } else {
    const args = extension.argsSchema.parse({ text, count: Number(count) });
    for await (const item of extension.execute(args, signal.signal)) console.log(extension.outputSchema.parse(item));
  }
} else {
  console.error('usage: ribbit-runtime-spike describe|check|run ROOT [TEXT] [COUNT]');
  process.exitCode = 2;
}
