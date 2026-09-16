import { test, expect } from 'bun:test';
import {
  scoreRank,
  scoreGroup,
  scoreReduce,
  scoreCompare,
  scoreExplain,
  rubricText,
} from '../../scripts/rubric-scoring.ts';

test('rank passes only on exact criterion order and full identity', () => {
  const expected = { order: ['a', 'c', 'b'] };
  const good = scoreRank(['a', 'c', 'b'], ['a', 'b', 'c'], expected, true);

  expect(good.pass).toBe(true);

  const wrongOrder = scoreRank(['a', 'b', 'c'], ['a', 'b', 'c'], expected, true);

  expect(wrongOrder.pass).toBe(false);
  expect(wrongOrder.criteria[1].pass).toBe(false);

  const missingId = scoreRank(['a', 'c'], ['a', 'b', 'c'], expected, true);

  expect(missingId.pass).toBe(false);
  expect(missingId.criteria[0].pass).toBe(false);

  const alteredValues = scoreRank(['a', 'c', 'b'], ['a', 'b', 'c'], expected, false);

  expect(alteredValues.pass).toBe(false);
});

test('group passes on exact partition and nonempty distinct labels', () => {
  const expected = { partition: [['a', 'd'], ['b'], ['c']] };
  const good = scoreGroup(
    [
      { label: 'network', memberIds: ['a', 'd'] },
      { label: 'database', memberIds: ['b'] },
      { label: 'auth', memberIds: ['c'] },
    ],
    ['a', 'b', 'c', 'd'],
    expected,
    true,
  );

  expect(good.pass).toBe(true);

  const wrongSplit = scoreGroup(
    [
      { label: 'network', memberIds: ['a'] },
      { label: 'db', memberIds: ['b', 'd'] },
      { label: 'auth', memberIds: ['c'] },
    ],
    ['a', 'b', 'c', 'd'],
    expected,
    true,
  );

  expect(wrongSplit.pass).toBe(false);

  const duplicateLabel = scoreGroup(
    [
      { label: 'x', memberIds: ['a', 'd'] },
      { label: 'x', memberIds: ['b'] },
      { label: 'y', memberIds: ['c'] },
    ],
    ['a', 'b', 'c', 'd'],
    expected,
    true,
  );

  expect(duplicateLabel.pass).toBe(false);
  expect(duplicateLabel.criteria[2].pass).toBe(false);
});

test('reduce scores fact coverage, fabrication absence and coherence', () => {
  const expected = { mustContain: ['timed out', 'database'], mustNotContain: ['migrated', 'DDoS'] };
  const good = scoreReduce(
    'The database connection timed out repeatedly across three hosts; no cause is confirmed.',
    expected,
    rubricText.reduce,
  );

  expect(good.pass).toBe(true);

  const hallucinated = scoreReduce(
    'We migrated the database and a DDoS caused repeated timeouts.',
    expected,
    rubricText.reduce,
  );

  expect(hallucinated.pass).toBe(false);
  expect(hallucinated.criteria[1].pass).toBe(false);

  const missingFact = scoreReduce('There were some failures on a few hosts.', expected, rubricText.reduce);

  expect(missingFact.pass).toBe(false);
  expect(missingFact.criteria[0].pass).toBe(false);
});

test('compare scores source labeling, attribution and conflation', () => {
  const expected = {
    leftOnly: ['5 seconds'],
    rightOnly: ['30 seconds'],
    mustNotContain: ['both files set the timeout to 30 seconds'],
  };
  const good = scoreCompare(
    'left.txt sets the timeout to 5 seconds; right.txt sets it to 30 seconds.',
    ['left.txt', 'right.txt'],
    expected,
    true,
  );

  expect(good.pass).toBe(true);

  const conflated = scoreCompare(
    'left.txt sets the timeout to 5 seconds; right.txt sets it to 30 seconds; both files set the timeout to 30 seconds.',
    ['left.txt', 'right.txt'],
    expected,
    true,
  );

  expect(conflated.pass).toBe(false);
  expect(conflated.criteria[1].pass).toBe(false);

  const modified = scoreCompare(
    'left.txt sets the timeout to 5 seconds; right.txt sets it to 30 seconds.',
    ['left.txt', 'right.txt'],
    expected,
    false,
  );

  expect(modified.pass).toBe(false);
  expect(modified.criteria[3].pass).toBe(false);
});

test('explain rejects fabrication, execution claims and audience jargon', () => {
  const expected = { mustContain: ['undefined', 'map'], mustNotContain: ['I ran'], forbid: ['stack trace'] };
  const good = scoreExplain(
    'The code tried to call map on a value that was undefined, so the property lookup failed.',
    expected,
    rubricText.explain,
  );

  expect(good.pass).toBe(true);

  const executed = scoreExplain(
    'I ran the code and it threw because of a stack trace on undefined map.',
    expected,
    rubricText.explain,
  );

  expect(executed.pass).toBe(false);
  expect(executed.criteria[1].pass).toBe(false);
  expect(executed.criteria[2].pass).toBe(false);
});

test('rubric text is defined and consistent for all five families', () => {
  expect(['rank', 'group', 'reduce', 'compare', 'explain'].every((c) => rubricText[c].length >= 3)).toBe(true);
});
