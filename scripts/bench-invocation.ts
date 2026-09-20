import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir, cpus } from 'node:os';
import { resolve, join } from 'node:path';

const binary = resolve('dist/ribbit'),
  dir = await mkdtemp(join(tmpdir(), 'ribbit-invocation-bench-'));
const env = { ...process.env, XDG_CONFIG_HOME: join(dir, 'config'), XDG_DATA_HOME: join(dir, 'data') };

async function command(args: string[], input = 'input') {
  const p = Bun.spawn([binary, ...args], { cwd: dir, env, stdin: new Blob([input]), stdout: 'pipe', stderr: 'pipe' });
  const [out, err, code] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text(), p.exited]);

  if (code) throw new Error(err);

  return out;
}

function stats(samples: number[]) {
  const sorted = [...samples].toSorted((a, b) => a - b);

  return {
    samplesMs: samples,
    p50Ms: sorted[Math.floor(sorted.length / 2)],
    p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1],
  };
}

let server: ReturnType<typeof Bun.serve> | undefined;

try {
  await command(['extensions', 'scaffold', join(dir, 'echo')], '');
  await command(['extensions', 'add', join(dir, 'echo')], '');
  await mkdir(join(dir, 'commands'));
  await writeFile(
    join(dir, 'commands', 'echo.yaml'),
    "apiVersion: ribbit/v1\nkind: Command\nname: echo\ntype: '@local/echo'\ntypeVersion: '1.0.0'\naction: run\n",
  );
  let start = performance.now();

  await command(['echo']);
  const firstExtensionMs = performance.now() - start;
  const extension: number[] = [];

  for (let i = 0; i < 30; i++) {
    start = performance.now();
    await command(['echo']);
    extension.push(performance.now() - start);
  }
  let requestMs = 0,
    requests = 0;

  server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    fetch() {
      requestMs = performance.now() - start;
      requests++;

      return new Response(
        'data: ' +
          JSON.stringify({ choices: [{ delta: { content: 'OK' }, finish_reason: 'stop' }] }) +
          '\n\ndata: [DONE]\n\n',
        { headers: { 'content-type': 'text/event-stream' } },
      );
    },
  });
  await mkdir(join(env.XDG_CONFIG_HOME, 'ribbit'), { recursive: true });
  await writeFile(
    join(env.XDG_CONFIG_HOME, 'ribbit', 'config.yaml'),
    `schemaVersion: 1\nproviders:\n  local:\n    type: openai-compatible\n    baseUrl: http://127.0.0.1:${server.port}/v1\n    defaultModel: fixture\n    capabilities: [text]\ndefault: {provider: local}\n`,
  );
  start = performance.now();
  await command(['ask', 'Reply OK']);
  const firstManagedMs = requestMs;
  const managed: number[] = [];

  for (let i = 0; i < 30; i++) {
    start = performance.now();
    await command(['ask', 'Reply OK']);
    managed.push(requestMs);
  }
  const report = {
    schemaVersion: 1,
    date: new Date().toISOString(),
    platform: process.platform,
    arch: process.arch,
    cpu: cpus()[0].model,
    runtime: Bun.version,
    method:
      'Fresh process from spawn to exit for deterministic extension; spawn to receipt of first HTTP request for managed overhead. First process separately, then 30 warm-cache observations. No cache flushing or inferred cold-filesystem claim.',
    firstExtensionMs,
    extension: stats(extension),
    firstManagedMs,
    managed: stats(managed),
    requests,
    checks: {
      extension: stats(extension).p95Ms <= 150 && firstExtensionMs <= 150,
      managed: stats(managed).p95Ms <= 100,
    },
  };

  await mkdir('benchmarks', { recursive: true });
  await writeFile('benchmarks/invocation-' + process.platform + '.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (!Object.values(report.checks).every(Boolean)) process.exitCode = 1;
} finally {
  server?.stop(true);
  await rm(dir, { recursive: true, force: true });
}
