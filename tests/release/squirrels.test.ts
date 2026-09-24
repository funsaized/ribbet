import { test, expect } from 'bun:test';
import { normalize, sampleNotes, summarize } from '../../examples/squirrel-report/normalize.ts';
import { verifyReport } from '../../examples/squirrel-report/verify-report.ts';
import { report } from '../../examples/squirrel-report/report.ts';
import { exactCommands } from '../../src/builtins/exact.ts';
import { semanticCommands } from '../../src/builtins/semantic.ts';
import { Budget, executeAction, type Context } from '../../src/sdk/index.ts';
import { sandbox, mockProvider } from '../../scripts/release/harness.ts';
import { rows as wireRows } from '../../scripts/release/cases.ts';

test('squirrel sample: exact counts, distinct row identities, annotation preservation and quote checks', async () => {
  const raw = await Bun.file('fixtures/tutorials/squirrels/sample.json').json();
  const data = normalize(raw);

  expect(summarize(data)).toMatchObject({
    total: 4,
    distinctUniqueSquirrelIds: 3,
    duplicateIdGroups: 1,
    noteRows: 3,
    missingAge: 3,
  });
  expect(data[2].age).toBeNull();
  expect(data[0].running).toBe(true);
  const originals = data.map((value, i) => ({
    id: String(i + 1),
    value,
    annotations: {},
    source: { path: 'sample.json' },
  }));
  const budget = new Budget({ maxRequests: 2 });
  let requests = 0;
  const ctx: Context = {
    budget,
    signal: budget.signal,
    log() {},
    llm: {
      async text() {
        throw new Error('Unexpected text request');
      },
      async object(_instruction, _evidence, schema) {
        requests++;

        return schema.parse({ behavior: 'foraging', human_involvement: false, quote: 'Foraging near a tree' });
      },
    },
  };

  try {
    const input = (async function* () {
      yield* originals;
    })();
    const selected = await Array.fromAsync(
      (await executeAction(
        exactCommands.where.actions.run,
        input,
        { field: 'has_note', equals: true },
        {},
        ctx,
      )) as AsyncIterable<(typeof originals)[number]>,
    );

    expect(selected.map((r) => r.id)).toEqual(['1', '2', '4']);
    expect(sampleNotes(data, 2)).toEqual([data[0], data[1]]);
    expect(requests).toBe(0);
    const annotated = await Array.fromAsync(
      (await executeAction(
        semanticCommands.map.actions.run,
        (async function* () {
          yield selected[0];
        })(),
        {
          instruction: 'Extract',
          annotate: 'observation',
          field: 'note',
          schema: 'examples/squirrel-report/observations.schema.json',
        },
        {},
        ctx,
      )) as AsyncIterable<(typeof originals)[number]>,
    );

    expect(annotated[0].value).toEqual(selected[0].value);
    expect(annotated[0].source).toEqual(selected[0].source);
    expect(annotated[0].annotations).toMatchObject({ observation: { quote: 'Foraging near a tree' } });
    expect(verifyReport('Observed "Foraging near a tree" [1]', selected)).toEqual([]);
    expect(verifyReport('Observed "invented" [1]', selected)).toHaveLength(1);
    expect(verifyReport('Observed "Foraging near a tree" [2]', selected)).toHaveLength(1);
    const rendered = report(data, [
      {
        ...selected[0],
        annotations: { observation: { behavior: 'foraging', human_involvement: false, quote: 'Foraging near a tree' } },
      },
    ]);

    expect(rendered).toContain('Population: 4 captured rows');
    expect(rendered).toContain('foraging 1');
    expect(rendered).toContain('[1] foraging, human involvement false: "Foraging near a tree"');
    expect(() =>
      report(data, [
        {
          ...selected[0],
          annotations: { observation: { behavior: 'other', human_involvement: false, quote: 'invented' } },
        },
      ]),
    ).toThrow('Unsupported observation');
  } finally {
    budget.close();
  }
});

test('packaged squirrel flow samples deterministically and keeps originals at model boundary', async () => {
  const provider = mockProvider();
  const env = await sandbox(provider.config);

  try {
    const input = normalize(await Bun.file('fixtures/tutorials/squirrels/sample.json').json());
    const replies = ['Foraging near a tree', 'Approached a person', 'Climbing a trunk'].map((quote) => ({
      behavior: 'other',
      human_involvement: false,
      quote,
    }));

    provider.reset(replies);
    const run = await env.run(
      [
        'flow',
        'run',
        'examples/flows/squirrel-report.yaml',
        '--input',
        'jsonl',
        '--output',
        'records',
        '--max-requests',
        '8',
      ],
      input.map((row) => JSON.stringify(row)).join('\n') + '\n',
    );

    expect(run.code, run.err).toBe(0);
    const output = wireRows(run.out);

    expect(output.map((r: { id: string }) => r.id)).toEqual(['1', '2', '4']);
    expect(output.map((r: { value: { unique_squirrel_id: string } }) => r.value.unique_squirrel_id)).toEqual([
      'same',
      'same',
      'fourth',
    ]);
    expect(output[0].annotations.observation.quote).toBe('Foraging near a tree');
    expect(provider.requests).toHaveLength(3);
    expect(provider.requests[0].messages[1].content).toContain('running');
    expect(provider.requests[0].messages[1].content).toContain('Foraging near a tree');
    provider.reset(replies);
    const limited = await env.run(
      ['flow', 'run', 'examples/flows/squirrel-report.yaml', '--input', 'jsonl', '--max-requests', '1'],
      input.map((row) => JSON.stringify(row)).join('\n') + '\n',
    );

    expect(limited.code).toBe(6);
    expect(provider.requests.length).toBeLessThan(3);
  } finally {
    await env.close();
    provider.close();
  }
}, 15000);
