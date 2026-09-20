import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { sandbox, mockProvider } from './release/harness.ts';

const brief = 'Mina will fix checkout by Friday for 240 euros. The reviewer is not assigned.';
const labels = [
  { reason: 'Checkout is blocked', label: 'blocking' },
  { reason: 'Only wording', label: 'cosmetic' },
  { reason: 'Accessible checkout is blocked', label: 'blocking' },
];

for (const [document, replies, expectedRequests] of [
  ['docs/tutorials/first-pipeline.md', [], 0],
  [
    'docs/tutorials/local-model.md',
    [...labels, 'R1 blocks purchases. R3 blocks accessible checkout. R2 is cosmetic.'],
    4,
  ],
  ['docs/tutorials/reusable-command.md', [brief, brief, brief, brief], 4],
  [
    'README.md',
    [labels[0], { reason: 'Only wording', label: 'other' }, labels[2], 'R1 and R3 block checkout; R2 is cosmetic.'],
    4,
  ],
] as const) {
  const provider = mockProvider();
  const env = await sandbox(provider.config);

  try {
    provider.reset([...replies]);
    const text = await readFile(document, 'utf8');
    const blocks = [...text.matchAll(/```sh\n([\s\S]*?)```/g)].map((match) => match[1]);
    const selected = document === 'README.md' ? blocks.filter((block) => !block.includes('npm install')) : blocks;
    const script = join(env.dir, 'lesson.sh');

    await writeFile(script, `set -euo pipefail\nribbit() { "$RIBBIT" "$@"; }\n${selected.join('\n')}\n`);
    const child = Bun.spawn(['bash', script.replaceAll('\\', '/')], {
      cwd: env.dir,
      env: { ...env.env, RIBBIT: env.binary.replaceAll('\\', '/') },
      stdin: 'ignore',
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const timeout = setTimeout(() => child.kill('SIGKILL'), 60000);
    let out, err, code;

    try {
      [out, err, code] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
      ]);
    } finally {
      clearTimeout(timeout);
    }
    assert.equal(code, 0, `${document}: ${err}`);
    assert.equal(provider.requests.length, expectedRequests, document);
    assert.equal(provider.remaining(), 0, document);
    if (document.endsWith('first-pipeline.md')) {
      const rows = out
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line));

      assert.equal(rows.length, 4);
      assert.deepEqual(rows.slice(2), [
        { ticket: 'R1', body: 'Checkout fails.' },
        { ticket: 'R1', body: 'Checkout fails.' },
      ]);
    }
    if (document.endsWith('local-model.md')) {
      const rows = (await readFile(join(env.dir, 'annotated.records'), 'utf8'))
        .trim()
        .split('\n')
        .slice(1)
        .map((line) => JSON.parse(line));

      assert.deepEqual(
        rows.map((row) => row.value.ticket),
        ['R1', 'R2', 'R3'],
      );
      assert(rows.every((row) => row.annotations.classify));
      assert.equal(provider.requests.at(-1).model, 'strong');
    }
    if (document === 'README.md') assert(out.startsWith('{"name":"Lin"}\n{"name":"Ada"}\n'));
    console.log(`${document}: documented shell blocks passed (${expectedRequests} mock requests)`);
  } finally {
    provider.close();
    await env.close();
  }
}
