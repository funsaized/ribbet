import { adapt, EXACT_LIMITS } from '../src/engine/records/index.ts';
import { take } from '../src/engine/execution/index.ts';

const before = process.resourceUsage().maxRSS;

async function* input() {
  for (let i = 0; i < 100_001; i++) yield new TextEncoder().encode(`{"n":${i}}\n`);
}

const adapted = await adapt(input(), 'jsonl', EXACT_LIMITS);

if (adapted.kind !== 'records') throw new Error('Expected records');
let count = 0;

for await (const record of take(adapted.records, 100_000)) {
  if ((record.value as { n: number }).n !== count) throw new Error('Order changed');
  count++;
}
const after = process.resourceUsage().maxRSS;
const result = {
  count,
  baselinePeakRssKiB: before,
  finalPeakRssKiB: after,
  incrementalPeakRssKiB: after - before,
  limitKiB: 128 * 1024,
};

console.log(JSON.stringify(result, null, 2));
if (count !== 100_000 || result.incrementalPeakRssKiB > result.limitKiB) process.exitCode = 1;
