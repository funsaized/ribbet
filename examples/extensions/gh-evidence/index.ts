import { execFile } from 'node:child_process';
import { defineAction, defineCommand, recordSchema, RibbitError, z, type Context } from '@ribbit/sdk';

const config = z.strictObject({});
const repo = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/(?!\.{1,2}$)[A-Za-z0-9_.-]{1,100}$/);
const number = z.number().int().positive().max(1_000_000_000);
const runArgs = z.strictObject({ repository: repo, number });
const author = z.object({ login: z.string() });
const discussion = z.object({
  id: z.number().int(),
  html_url: z.string(),
  body: z
    .string()
    .nullish()
    .transform((body) => body ?? null),
  user: author.nullable(),
});
const review = discussion.extend({ state: z.string(), submitted_at: z.string().nullable() });
const reviewComment = discussion.extend({ path: z.string(), diff_hunk: z.string() });
const pull = z.object({
  id: z.number().int(),
  number,
  html_url: z.string(),
  title: z.string(),
  body: z
    .string()
    .nullish()
    .transform((body) => body ?? null),
  user: author.nullable(),
  head: z.object({ sha: z.string().regex(/^[a-f0-9]{40}$/) }),
});
const file = z.object({
  filename: z.string(),
  status: z.string(),
  additions: z.number().int(),
  deletions: z.number().int(),
  patch: z.string().optional(),
  blob_url: z.string(),
});
const check = z.object({
  id: z.number().int(),
  html_url: z.string(),
  name: z.string(),
  status: z.string(),
  conclusion: z.string().nullable(),
});
const status = z.object({
  id: z.number().int(),
  context: z.string(),
  state: z.string(),
  target_url: z.string().nullable(),
  description: z.string().nullable(),
});
const kinds = ['issueComments', 'reviews', 'reviewComments', 'files', 'checkRuns', 'statuses'] as const;

type Kind = (typeof kinds)[number];
const schemas = {
  issueComments: discussion,
  reviews: review,
  reviewComments: reviewComment,
  files: file,
  checkRuns: check,
  statuses: status,
};
const bundle = z.strictObject({
  version: z.literal(1),
  repository: repo,
  number,
  pull,
  issueComments: z.array(discussion).max(100),
  reviews: z.array(review).max(100),
  reviewComments: z.array(reviewComment).max(100),
  files: z.array(file).max(100),
  checkRuns: z.array(check).max(100),
  statuses: z.array(status).max(100),
  truncated: z.array(z.enum(kinds)).max(kinds.length),
});

type Bundle = z.infer<typeof bundle>;
const LIMIT = 1024 * 1024;

function normalize(text: string, ctx: Context) {
  ctx.budget.check();
  if (Buffer.byteLength(text) > LIMIT) throw new RibbitError(6, 'Evidence bundle exceeds 1 MiB');
  let raw: unknown;

  try {
    raw = JSON.parse(text);
  } catch {
    throw new RibbitError(2, 'Malformed evidence bundle');
  }
  const parsed = bundle.safeParse(raw);

  if (!parsed.success) throw new RibbitError(2, 'Invalid evidence bundle');
  const b = parsed.data;

  if (b.pull.number !== b.number || new Set(b.truncated).size !== b.truncated.length)
    throw new RibbitError(2, 'Inconsistent evidence bundle');
  if (kinds.some((kind) => b[kind].length === 100 && !b.truncated.includes(kind)))
    throw new RibbitError(2, 'Full evidence page must be marked truncated');
  const rows: z.infer<typeof recordSchema>[] = [];
  const ids = new Set<string>();
  const add = (kind: string, id: string, data: object, url: string, annotations = {}) => {
    const key = `${kind}:${id}`;

    if (ids.has(key)) throw new RibbitError(2, 'Duplicate evidence identity');
    ids.add(key);
    rows.push({
      id: key,
      value: { kind, repository: b.repository, pr: b.number, ...data },
      source: { path: url },
      annotations,
    });
  };

  add('pull', String(b.pull.id), b.pull, b.pull.html_url, { acquisition: { truncated: b.truncated } });
  for (const kind of ['issueComments', 'reviews', 'reviewComments', 'checkRuns'] as const)
    for (const item of b[kind]) add(kind, String(item.id), item, item.html_url);
  for (const item of b.files) add('files', item.filename, item, item.blob_url);
  for (const item of b.statuses) add('statuses', String(item.id), item, item.target_url ?? b.pull.html_url);

  return rows;
}

async function acquire(a: z.infer<typeof runArgs>, ctx: Context) {
  const base = `repos/${a.repository}`;
  const deadline = AbortSignal.timeout(20_000);
  let bytes = 0;

  async function request(path: string): Promise<unknown> {
    ctx.budget.check();
    if (ctx.signal.aborted) throw ctx.signal.reason;
    if (deadline.aborted) throw new RibbitError(6, 'GitHub acquisition deadline exceeded');
    let timedOut = false;

    try {
      const stdout = await new Promise<Buffer>((resolve, reject) => {
        const child = execFile(
          'gh',
          ['api', '--method', 'GET', path],
          {
            encoding: 'buffer',
            maxBuffer: 256 * 1024,
            detached: process.platform !== 'win32',
          } as Parameters<typeof execFile>[2],
          (error, output) => {
            clearTimeout(timer);
            ctx.signal.removeEventListener('abort', stop);
            deadline.removeEventListener('abort', stop);
            if (error) reject(error);
            else resolve(output as Buffer);
          },
        );
        const stop = () => {
          if (process.platform !== 'win32' && child.pid) {
            try {
              process.kill(-child.pid, 'SIGKILL');
            } catch {
              child.kill('SIGKILL');
            }
          } else child.kill('SIGKILL');
        };
        const timer = setTimeout(() => {
          timedOut = true;
          stop();
        }, 4_000);

        ctx.signal.addEventListener('abort', stop, { once: true });
        deadline.addEventListener('abort', stop, { once: true });
        if (ctx.signal.aborted || deadline.aborted) stop();
      });

      bytes += stdout.byteLength;
      if (bytes > LIMIT) throw new RibbitError(6, 'GitHub response budget exceeded');
      try {
        return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(stdout));
      } catch {
        throw new RibbitError(5, 'Malformed GitHub response');
      }
    } catch (error) {
      if (ctx.signal.aborted) throw ctx.signal.reason;
      if (deadline.aborted) throw new RibbitError(6, 'GitHub acquisition deadline exceeded');
      if (error instanceof RibbitError) throw error;
      if ((error as NodeJS.ErrnoException).code === 'ENOENT')
        throw new RibbitError(7, 'gh is not installed or not on PATH');
      if ((error as NodeJS.ErrnoException).code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER')
        throw new RibbitError(6, 'GitHub response exceeds 256 KiB');
      if (timedOut) throw new RibbitError(6, 'GitHub request timed out');
      throw new RibbitError(7, 'gh request failed (check authentication and network; details redacted)');
    }
  }

  const p = pull.safeParse(await request(`${base}/pulls/${a.number}`));

  if (!p.success || p.data.number !== a.number) throw new RibbitError(5, 'Invalid GitHub pull response');
  const result: Bundle = {
    version: 1,
    ...a,
    pull: p.data,
    issueComments: [],
    reviews: [],
    reviewComments: [],
    files: [],
    checkRuns: [],
    statuses: [],
    truncated: [],
  };
  const paths: Record<Kind, string> = {
    issueComments: `${base}/issues/${a.number}/comments`,
    reviews: `${base}/pulls/${a.number}/reviews`,
    reviewComments: `${base}/pulls/${a.number}/comments`,
    files: `${base}/pulls/${a.number}/files`,
    checkRuns: `${base}/commits/${p.data.head.sha}/check-runs`,
    statuses: `${base}/commits/${p.data.head.sha}/statuses`,
  };

  for (const kind of kinds) {
    for (let page = 1; page <= 2; page++) {
      const response = await request(`${paths[kind]}?per_page=50&page=${page}`);
      const list: unknown =
        kind === 'checkRuns' && response && typeof response === 'object' && !Array.isArray(response)
          ? (response as { check_runs?: unknown }).check_runs
          : response;

      if (!Array.isArray(list) || list.length > 50) throw new RibbitError(5, 'Invalid GitHub page');
      const parsed = z.array(schemas[kind]).safeParse(list);

      if (!parsed.success) throw new RibbitError(5, 'Invalid GitHub page');
      // Each kind's elements are validated above; the discriminated assignment keeps the saved bundle typed.
      (result[kind] as unknown[]).push(...parsed.data);
      if (list.length < 50) break;
      if (page === 2) result.truncated.push(kind);
    }
  }

  return normalize(JSON.stringify(result), ctx);
}

async function report<T>(work: () => T | Promise<T>, ctx: Context): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (!ctx.signal.aborted)
      ctx.log(error instanceof RibbitError ? error.message : 'GitHub evidence failed (details redacted)');
    throw error;
  }
}

export default defineCommand({
  type: '@examples/gh-evidence',
  version: '1.0.0',
  description: 'Read-only, bounded GitHub PR evidence (no inference)',
  config,
  actions: {
    run: defineAction({
      config,
      args: runArgs,
      input: z.null(),
      output: z.array(recordSchema),
      mode: 'value',
      inputKind: 'none',
      outputKind: 'records',
      capabilities: [],
      effects: ['process', 'network-read'],
      description: 'Fetch PR discussion, files and check results using gh',
      execute: ({ args }, ctx) => report(() => acquire(args, ctx), ctx),
    }),
    normalize: defineAction({
      config,
      args: z.strictObject({}),
      input: z.string(),
      output: z.array(recordSchema),
      mode: 'value',
      inputKind: 'text',
      outputKind: 'records',
      capabilities: [],
      effects: [],
      description: 'Replay a saved bounded JSON evidence bundle',
      execute: ({ input }, ctx) => report(() => normalize(input, ctx), ctx),
    }),
  },
});
