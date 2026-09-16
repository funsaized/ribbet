import { createReadStream } from 'node:fs';
import {
  adapt,
  EXACT_LIMITS,
  SEMANTIC_LIMITS,
  type InputMode,
  RibbitError,
  serialize,
  type RecordValue,
} from '../../engine/records/index.ts';
import type { Data } from '../../engine/runtime/index.ts';
import type { Runtime } from '../parser/index.ts';
import type { ActionManifest } from '../../sdk/manifest/index.ts';
export async function readInput(
  runtime: Runtime,
  action: ActionManifest,
  args: Record<string, any>,
  semantic: boolean,
  zeroTake = false,
): Promise<Data> {
  if (zeroTake) return { kind: 'records', records: (async function* () {})() };
  const mode = (runtime.input ?? 'auto') as InputMode;
  let source: AsyncIterable<Uint8Array> = process.stdin;
  if (runtime.file || action.inputKind === 'none') {
    if (!process.stdin.isTTY) {
      const iterator = process.stdin[Symbol.asyncIterator]();
      try {
        const part = await iterator.next();
        if (!part.done && part.value.length)
          throw new RibbitError(
            2,
            runtime.file
              ? 'stdin and --file cannot both supply data'
              : 'This command owns its file inputs and rejects stdin',
          );
      } finally {
        await iterator.return?.();
      }
    }
    if (action.inputKind === 'none') {
      if (runtime.file) throw new RibbitError(2, 'This command owns explicit files; --file is not allowed');
      return { kind: 'json', value: null };
    }
    source = createReadStream(String(runtime.file));
  } else if (process.stdin.isTTY) source = (async function* () {})();
  const defaults = semantic ? SEMANTIC_LIMITS : EXACT_LIMITS;
  return adapt(
    source,
    mode,
    {
      maxBytes: Number(runtime['max-bytes'] ?? defaults.maxBytes),
      maxRecords: Number(runtime['max-records'] ?? defaults.maxRecords),
    },
    runtime.file ? String(runtime.file) : undefined,
  );
}
function treeDisplay(value: any): string {
  const nodes = value.nodes as RecordValue[];
  const children = new Map<string, RecordValue[]>();
  for (const r of nodes) {
    const path = (r.value as any).relativePath as string,
      parent = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
    children.set(parent, [...(children.get(parent) ?? []), r]);
  }
  const lines = [value.root];
  function render(parent: string, prefix: string) {
    const rows = children.get(parent) ?? [];
    rows.forEach((r, i) => {
      const file = r.value as any,
        last = i === rows.length - 1,
        description = (r.annotations.tree as any)?.description;
      lines.push(
        prefix +
          (last ? '└── ' : '├── ') +
          file.relativePath.split('/').at(-1) +
          (description ? ` — ${description} [${value.evidence}]` : ''),
      );
      render(file.relativePath, prefix + (last ? '    ' : '│   '));
    });
  }
  render('', '');
  return lines.join('\n');
}
export async function* output(data: Data, runtime: Runtime, name: string): AsyncGenerator<string> {
  const mode = runtime.output as string | undefined;
  if (data.kind === 'textStream') {
    if (!mode || mode === 'text') {
      yield* data.chunks;
      return;
    }
    let value = '';
    for await (const chunk of data.chunks) value += chunk;
    data = { kind: 'text', value };
  }
  if (mode && !['records', 'jsonl', 'text', 'json'].includes(mode)) throw new RibbitError(2, 'Unknown output format');
  if (data.kind === 'records') {
    if (mode && !['records', 'jsonl'].includes(mode))
      throw new RibbitError(2, 'Record commands support --output records or jsonl; use render for display');
    yield* serialize(data.records, mode === 'jsonl' ? 'jsonl' : 'records');
    return;
  }
  if (mode === 'records') {
    yield* serialize(
      (async function* () {
        yield { id: '1', value: data.value as any, annotations: {} };
      })(),
    );
    return;
  }
  const value = name === 'tree' && !mode ? treeDisplay(data.value) : data.value;
  if (mode === 'json' || mode === 'jsonl' || (data.kind === 'json' && !(name === 'tree' && !mode)))
    yield JSON.stringify(value) + '\n';
  else {
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    yield text.endsWith('\n') ? text : text + '\n';
  }
}
export async function write(chunks: AsyncIterable<string>) {
  let error: Error | undefined;
  const onError = (e: Error) => {
    error = e;
  };
  process.stdout.on('error', onError);
  try {
    for await (const chunk of chunks) {
      if (error) throw error;
      await new Promise<void>((resolve, reject) => process.stdout.write(chunk, (e) => (e ? reject(e) : resolve())));
    }
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'EPIPE') return;
    if (e instanceof RibbitError) throw e;
    throw new RibbitError(7, 'Output write failed');
  } finally {
    process.stdout.removeListener('error', onError);
  }
}
