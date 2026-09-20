import { test, expect } from 'bun:test';
import { cp, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { sandbox, mockProvider } from '../../scripts/release/harness.ts';
import { rows } from '../../scripts/release/cases.ts';

const labels = [
  { reason: 'All purchases fail', label: 'blocking' },
  { reason: 'Only spelling', label: 'cosmetic' },
  { reason: 'Screen reader purchase blocked', label: 'blocking' },
];
const final = 'R1: Checkout blocks purchases. R3: Screen reader users are blocked. R2: Cosmetic typo.';

test('triage shell, inline, and saved flow agree; original evidence reaches stronger model', async () => {
  const provider = mockProvider(),
    env = await sandbox(provider.config);
  const input = await readFile('fixtures/release/feedback.jsonl', 'utf8');

  try {
    const plan = await env.run(['flow', 'plan', 'examples/flows/triage.yaml']);

    expect(plan.code, plan.err).toBe(0);
    expect(JSON.parse(plan.out).steps.map((s: any) => s.route?.model ?? null)).toEqual([null, 'small', 'strong']);
    expect(provider.requests.length).toBe(0);
    expect((await env.run(['flow', 'validate', 'examples/flows/triage.yaml'])).code).toBe(0);
    const classify = [
      'classify',
      '--field',
      'body',
      '--label',
      'blocking=Prevents a customer from completing a purchase',
      '--label',
      'cosmetic=Appearance or wording with no functional impact',
      '--label',
      'unknown=Insufficient evidence to determine impact',
      '--unknown-label',
      'unknown',
      '--profile',
      'local-small',
    ];
    const instruction =
      'Prioritize the tickets. Cite every ticket ID and preserve accessibility failures. Treat labels as fallible suggestions; verify against original bodies. Separate observations from hypotheses.';
    const commands = [['select', 'ticket,body,component'], classify, ['reduce', instruction, '--profile', 'stronger']];

    // Actual OS pipes, with pipefail; script is static and all user data enters stdin.
    provider.reset([...labels, final]);
    const shell = `set -o pipefail\n"$RIBBIT" select ticket,body,component --input jsonl | "$RIBBIT" classify --field body --label 'blocking=Prevents a customer from completing a purchase' --label 'cosmetic=Appearance or wording with no functional impact' --label 'unknown=Insufficient evidence to determine impact' --unknown-label unknown --profile local-small | "$RIBBIT" reduce 'Prioritize the tickets. Cite every ticket ID and preserve accessibility failures. Treat labels as fallible suggestions; verify against original bodies. Separate observations from hypotheses.' --profile stronger`;
    const process = Bun.spawn(['bash', '-c', shell], {
      cwd: env.dir,
      env: { ...env.env, RIBBIT: env.binary.replaceAll('\\', '/') },
      stdin: new Blob([input]),
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const shellOut = await new Response(process.stdout).text();

    expect(await process.exited, await new Response(process.stderr).text()).toBe(0);
    expect(shellOut.trim()).toBe(final);
    const baselineRequests = structuredClone(provider.requests);

    for (const invocation of [
      ['flow', 'run', '--input', 'jsonl', '--', ...commands.flatMap((c, i) => (i ? ['::', ...c] : c))],
      ['flow', 'run', 'examples/flows/triage.yaml', '--input', 'jsonl'],
    ]) {
      provider.reset([...labels, final]);
      const result = await env.run(invocation, input);

      expect(result.code, result.err).toBe(0);
      expect(result.out).toBe(shellOut);
      expect(provider.requests).toEqual(baselineRequests);
    }
    expect(provider.requests.map((r) => r.model)).toEqual(['small', 'small', 'small', 'strong']);
    const evidence = provider.requests[3].messages[1].content.split('\n').map((s: string) => JSON.parse(s));
    const original = input
      .trim()
      .split('\n')
      .map((s) => JSON.parse(s));

    expect(evidence.map((r: any) => r.value)).toEqual(original);
    expect(evidence.every((r: any) => r.annotations.classify)).toBe(true);
    provider.reset([...labels, final]);
    expect(
      (
        await env.run(
          ['flow', 'run', 'examples/flows/triage.yaml', '--input', 'jsonl', '--force-profile', 'stronger'],
          input,
        )
      ).code,
    ).toBe(0);
    expect(provider.requests.every((r) => r.model === 'strong')).toBe(true);
    provider.reset(labels);
    const budgeted = await env.run(
      ['flow', 'run', 'examples/flows/triage.yaml', '--input', 'jsonl', '--max-requests', '2'],
      input,
    );

    expect(budgeted.code).toBe(6);
    expect(provider.requests.length).toBe(2);
  } finally {
    await env.close();
    provider.close();
  }
}, 15000);

test('context recipe preserves both files and annotations at the harness boundary', async () => {
  const provider = mockProvider(),
    env = await sandbox(provider.config);

  try {
    provider.reset([
      { reason: 'Checks sessions', label: 'relevant' },
      { reason: 'Only colors', label: 'other' },
    ]);
    const context = await env.run(['flow', 'run', 'examples/flows/context.yaml', '--output', 'records']);

    expect(context.code, context.err).toBe(0);
    const records = rows(context.out);

    expect(records.map((r) => r.value.relativePath)).toEqual(['auth.ts', 'colors.ts']);
    expect(records.map((r) => r.annotations.classify.label)).toEqual(['relevant', 'other']);
    expect(records.every((r) => r.source.path === r.value.path && r.value.content)).toBe(true);
    // A separate receiver consumes only the documented wire format; no Ribbit internals.
    const receiver = Bun.spawn(
      [
        'python3',
        '-c',
        'import json,sys; header=json.loads(sys.stdin.readline()); assert header == {"$ribbit":{"version":1,"kind":"records"}}; rows=[json.loads(s) for s in sys.stdin]; assert len(rows)==2; assert all(r["value"]["content"] and r["source"]["path"] for r in rows); print("boundary verified")',
      ],
      { stdin: new Blob([context.out]), stdout: 'pipe', stderr: 'pipe', cwd: env.dir, env: env.env },
    );

    expect(await receiver.exited, await new Response(receiver.stderr).text()).toBe(0);
    expect(await new Response(receiver.stdout).text()).toContain('boundary verified');
    const exported = await env.run(['render', '--as', 'jsonl'], context.out);

    expect(exported.out).not.toContain('annotations');
  } finally {
    await env.close();
    provider.close();
  }
});

test('named brief reuses defaults in a saved flow', async () => {
  const provider = mockProvider(),
    env = await sandbox(provider.config);

  try {
    await mkdir(join(env.dir, 'commands'));
    await cp('examples/commands/brief.yaml', join(env.dir, 'commands/brief.yaml'));
    provider.reset(['Mina fixes checkout by Friday for 240 euros.', 'Mina will fix checkout by Friday for 240 euros.']);
    const result = await env.run(
      ['flow', 'run', 'examples/flows/brief.yaml'],
      await readFile('fixtures/release/meeting.txt', 'utf8'),
    );

    expect(result.code, result.err).toBe(0);
    expect(result.out.trim()).toBe('Mina will fix checkout by Friday for 240 euros.');
    expect(provider.requests[0].messages[0].content).toContain('40');
    expect(provider.requests[1].messages[1].content).toBe('Mina fixes checkout by Friday for 240 euros.');
  } finally {
    await env.close();
    provider.close();
  }
});
