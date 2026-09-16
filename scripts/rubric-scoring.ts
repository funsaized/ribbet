// Rubric scoring for EVAL-02. Pure functions only: no provider, no I/O, no process env.
// Each criterion returns a boolean so the runner can report per-criterion PASS/FAIL.
// Ground truth is authored against the evidence; scoring checks output *facts* (present/
// absent entities, correct order/partition, file integrity), not schema shape or regex on
// generic words. Free-text quality still requires an independent reviewer pass alongside;
// these checks are the deterministic floor, not a substitute for it.

export interface RankExpected {
  order: string[];
  top?: number;
}
export interface GroupExpected {
  partition: string[][];
}
export interface FactExpected {
  mustContain: string[];
  mustNotContain: string[];
}
export interface CompareExpected {
  leftOnly: string[];
  rightOnly: string[];
  mustNotContain: string[];
}
export interface ExplainExpected {
  mustContain: string[];
  mustNotContain: string[];
  forbid?: string[];
}

export interface CaseResult {
  command: string;
  criteria: { text: string; pass: boolean }[];
  pass: boolean;
  detail: Record<string, unknown>;
}

// Execution/fix claims are authored per-case into mustNotContain; the scorer only needs
// the shared text-matching helpers below.

// Normalize before matching: case, markdown emphasis/backticks, and whitespace are formatting,
// not factuality. A `mustContain` entry may give alternatives with `|` (any one satisfies).
const normalize = (s: string) => s.toLowerCase().replace(/[`*]/g, '').replace(/,/g, '').replace(/\s+/g, ' ').trim();
const has = (text: string, needle: string) => needle.split('|').some((alt) => normalize(text).includes(normalize(alt)));
const hasAny = (text: string, needles: string[]) => needles.some((n) => has(text, n));
const setEq = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
const setOfSetsEq = (a: string[][], b: string[][]) =>
  a.length === b.length && a.every((group) => b.some((g) => setEq(group, g)));

export function scoreRank(
  actualOrder: string[],
  inputIds: string[],
  expected: RankExpected,
  valuesUnchanged: boolean,
): CaseResult {
  const unique = actualOrder.length === inputIds.length && setEq(actualOrder, inputIds);
  const top = expected.top ?? actualOrder.length;
  const prefix = actualOrder.slice(0, top);
  const orderOk = setEq(prefix, expected.order.slice(0, top)) && prefix.every((id, i) => id === expected.order[i]);
  return {
    command: 'rank',
    criteria: [
      { text: 'Returns every input ID exactly once', pass: unique },
      { text: 'Ordering matches the stated criterion', pass: orderOk },
      { text: 'Record values are unchanged (rank reorders only)', pass: valuesUnchanged },
    ],
    pass: unique && orderOk && valuesUnchanged,
    detail: { actualOrder, expectedOrder: expected.order, top },
  };
}

export function scoreGroup(
  actualGroups: { label: string; memberIds: string[] }[],
  inputIds: string[],
  expected: GroupExpected,
  valuesUnchanged: boolean,
): CaseResult {
  const flat = actualGroups.flatMap((g) => g.memberIds);
  const identity = flat.length === inputIds.length && setEq(flat, inputIds) && new Set(flat).size === flat.length;
  const membership = setOfSetsEq(
    actualGroups.map((g) => g.memberIds),
    expected.partition,
  );
  const labels =
    actualGroups.every((g) => g.label.trim().length > 0) &&
    new Set(actualGroups.map((g) => g.label.trim())).size === actualGroups.length;
  return {
    command: 'group',
    criteria: [
      { text: 'Every input ID belongs to exactly one group', pass: identity },
      { text: 'Group membership matches the stated criterion', pass: membership },
      { text: 'Each group has a nonempty, distinct label', pass: labels },
      { text: 'Member records are unchanged (group partitions only)', pass: valuesUnchanged },
    ],
    pass: identity && membership && labels && valuesUnchanged,
    detail: {
      actualPartition: actualGroups.map((g) => g.memberIds),
      expectedPartition: expected.partition,
      labels: actualGroups.map((g) => g.label),
    },
  };
}

export function scoreReduce(text: string, expected: FactExpected, criteria: string[]): CaseResult {
  const coverage = expected.mustContain.every((f) => has(text, f));
  const fidelity = expected.mustNotContain.length === 0 || !hasAny(text, expected.mustNotContain);
  const coherent = text.trim().length > 20 && !/\n\s*\{"/.test(text); // not raw record passthrough
  return {
    command: 'reduce',
    criteria: [
      { text: criteria[0], pass: coverage },
      { text: criteria[1], pass: fidelity },
      { text: criteria[2], pass: coherent },
    ],
    pass: coverage && fidelity && coherent,
    detail: { mustContain: expected.mustContain, mustNotContain: expected.mustNotContain },
  };
}

export function scoreCompare(
  text: string,
  paths: string[],
  expected: CompareExpected,
  filesUnchanged: boolean,
): CaseResult {
  const labeled = paths.every((p) => has(text, p));
  const leftCovered = expected.leftOnly.every((f) => has(text, f));
  const rightCovered = expected.rightOnly.every((f) => has(text, f));
  const noConflation = expected.mustNotContain.length === 0 || !hasAny(text, expected.mustNotContain);
  return {
    command: 'compare',
    criteria: [
      { text: 'Labels and keeps the two sources distinct', pass: labeled },
      { text: 'Attributes each claim to the correct source', pass: leftCovered && rightCovered && noConflation },
      { text: 'Covers the requested focus', pass: leftCovered || rightCovered },
      { text: 'Modifies neither input file', pass: filesUnchanged },
    ],
    pass: labeled && leftCovered && rightCovered && noConflation && filesUnchanged,
    detail: { paths, leftOnly: expected.leftOnly, rightOnly: expected.rightOnly },
  };
}

export function scoreExplain(text: string, expected: ExplainExpected, criteria: string[]): CaseResult {
  const accuracy = expected.mustContain.every((f) => has(text, f));
  const fidelity = expected.mustNotContain.length === 0 || !hasAny(text, expected.mustNotContain);
  const audience = !expected.forbid || expected.forbid.length === 0 || !hasAny(text, expected.forbid);
  const coherent = text.trim().length > 20;
  return {
    command: 'explain',
    criteria: [
      { text: criteria[0], pass: accuracy },
      { text: criteria[1], pass: fidelity },
      { text: criteria[2], pass: audience },
      { text: criteria[3], pass: coherent },
    ],
    pass: accuracy && fidelity && audience && coherent,
    detail: { mustContain: expected.mustContain, mustNotContain: expected.mustNotContain },
  };
}

export const rubricText: Record<string, string[]> = {
  rank: [
    'Returns every input ID exactly once',
    'Ordering matches the stated criterion',
    'Record values are unchanged (rank reorders only)',
  ],
  group: [
    'Every input ID belongs to exactly one group',
    'Group membership matches the stated criterion',
    'Each group has a nonempty, distinct label',
    'Member records are unchanged (group partitions only)',
  ],
  reduce: [
    'Captures the salient facts and recurrence the instruction requests',
    'Separates observations from hypotheses; invents no cause or remedy',
    'Returns a single coherent summary',
  ],
  compare: [
    'Labels and keeps the two sources distinct',
    'Attributes each claim to the correct source',
    'Covers the requested focus',
    'Modifies neither input file',
  ],
  explain: [
    'Explains the input accurately without inventing facts',
    'Distinguishes evidence from uncertainty; makes no claim of execution or tool use',
    'Is appropriate for the stated audience',
    'Returns a single coherent explanation',
  ],
};
