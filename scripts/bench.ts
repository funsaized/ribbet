import { binaryName } from './platform.ts';
import { writeFile } from 'node:fs/promises';
import { cpus, totalmem } from 'node:os';
import { resolve } from 'node:path';

const binary = resolve('dist', binaryName);
const runs = 30;

async function measure(args: string[], input = '') {
  const samples = [];

  for (let i = 0; i < runs + 1; i++) {
    const start = performance.now();
    const p = Bun.spawn([binary, ...args], { stdin: new Blob([input]), stdout: 'ignore', stderr: 'pipe' });

    if (await p.exited) throw new Error(await new Response(p.stderr).text());
    if (i) samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);

  return {
    n: runs,
    samplesMs: samples,
    p50Ms: samples[Math.floor(runs * 0.5)],
    p95Ms: samples[Math.ceil(runs * 0.95) - 1],
  };
}

const results = {
  schemaVersion: 1,
  date: new Date().toISOString(),
  platform: process.platform,
  arch: process.arch,
  cpu: cpus()[0].model,
  ramBytes: totalmem(),
  runtime: Bun.version,
  help: await measure(['--help']),
  version: await measure(['--version']),
  take: await measure(['take', '1', '--input', 'lines', '--output', 'jsonl'], 'a\nb\n'),
};
const report = {
  ...results,
  checks: { startup: results.help.p95Ms <= 100 && results.version.p95Ms <= 100 },
  unverified: [
    '100k incremental RSS',
    'extension invocation overhead',
    'managed pre-HTTP overhead',
    'macOS reference timing',
  ],
};

await writeFile(process.env.RIBBIT_BENCH_OUTPUT || 'benchmarks/latest.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.checks.startup) process.exitCode = 1;
