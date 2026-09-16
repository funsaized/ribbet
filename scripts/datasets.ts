import { writeFile } from 'node:fs/promises';
// Regenerates evals/datasets/core.json (unchanged since EVAL-01), task.schema.json and
// rubric-cases.json. Core data is identical to the EVAL-01 frozen version; do not edit it
// without re-running the semantic evaluation. Rubric cases are authored against the release
// contract (>=30 cases/family, factuality ground truth); see evals/README.md and
// scripts/rubric-scoring.ts for the scoring contract.

const cases: any[] = [];
for (let i = 0; i < 100; i++) {
  const positive = i % 2 === 0;
  cases.push({
    id: `filter-${i}`,
    split: i < 20 ? 'development' : 'held-out',
    command: 'filter',
    args: { instruction: 'Keep reports of failed network connections or network timeouts.' },
    input: `Service ${i}: ${positive ? (i % 4 === 0 ? 'connection timed out while contacting the database' : 'network connection refused by the remote service') : i % 4 === 1 ? 'connection established successfully' : 'processed a local file successfully'}.`,
    expected: positive,
  });
  const labels = ['bug', 'feature', 'praise', 'unknown'];
  const label = labels[i % 4];
  const phrases = [
    'The Save button crashes the application.',
    'Please add an export-to-CSV option.',
    'The interface is excellent and easy to use.',
    'No product feedback is available.',
  ];
  cases.push({
    id: `classify-${i}`,
    split: i < 20 ? 'development' : 'held-out',
    command: 'classify',
    args: { labels: labels.join(',') },
    input: `Feedback ticket ${i}: ${phrases[i % 4]}`,
    expected: label,
  });
}
for (let i = 0; i < 50; i++) {
  const owner = i % 5 === 0 ? null : `Person ${i}`,
    due = i % 3 === 0 ? null : `2026-10-${String((i % 28) + 1).padStart(2, '0')}`;
  cases.push({
    id: `extract-${i}`,
    split: i < 10 ? 'development' : 'held-out',
    command: 'extract',
    args: {
      instruction: 'Extract the task title, owner and due date. Use null for facts not stated.',
      schema: 'evals/datasets/task.schema.json',
    },
    input: `Task title: Review item ${i}. ${owner ? `Owner: ${owner}.` : 'No owner assigned.'} ${due ? `Due: ${due}.` : 'No due date given.'}`,
    expected: { title: `Review item ${i}`, owner, due },
  });
}
await writeFile('evals/datasets/core.json', JSON.stringify(cases, null, 2) + '\n');
await writeFile(
  'evals/datasets/task.schema.json',
  JSON.stringify(
    {
      type: 'object',
      properties: {
        title: { type: 'string' },
        owner: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        due: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
      required: ['title', 'owner', 'due'],
      additionalProperties: false,
    },
    null,
    2,
  ) + '\n',
);

// ---------------------------------------------------------------------------
// Rubric families. Each case is domain-aligned (shell data manipulation), carries the
// actual CLI args the user would type, structured input, a per-command rubric, and a
// factuality `expected` ground truth. Splits: bodies 0-1 are development, bodies 2+ held-out.
// ---------------------------------------------------------------------------

interface Rec {
  id: string;
  value: string;
}
const rubric = (command: string) =>
  ({
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
  })[command];

// Every record carries an explicit severity word, an explicit date and an explicit USD impact so
// each instruction has an objective correct order. The id->field assignment rotates per body; the
// three orders are derived and asserted distinct, so no ordering depends on author judgment.
const rankInstructions = [
  { key: 'severity', text: 'Rank the tickets by severity, most severe first.' },
  { key: 'recency', text: 'Rank the tickets by how recently they were reported, most recent first.' },
  { key: 'impact', text: 'Rank the tickets by estimated customer impact, highest first.' },
];
const rankIds = ['a', 'b', 'c', 'd'];
const rankSevWords = ['Critical', 'High', 'Medium', 'Low'];
const rankDates = ['2026-09-15', '2026-09-14', '2026-09-13', '2026-09-12'];
const rankImpacts = ['$5,000,000', '$2,000,000', '$400,000', '$0'];
const rankBodies: { Critical: string; High: string; Medium: string; Low: string }[] = [
  {
    Critical: 'Payment checkout is down for all customers',
    High: 'EU customers cannot complete VAT validation',
    Medium: 'CSV export truncates rows beyond 50k',
    Low: 'Footer shows last year\u2019s copyright',
  },
  {
    Critical: 'Order service drops every scheduled job',
    High: 'Admin dashboard loses session on refresh',
    Medium: 'Mobile nav collapses on narrow screens',
    Low: 'Search results show a trailing comma',
  },
  {
    Critical: 'SSO login is down for every tenant',
    High: 'Webhook delivery is delayed during peak',
    Medium: 'Avatar images render at the wrong aspect ratio',
    Low: 'Docs page has a broken anchor link',
  },
  {
    Critical: 'Replica writes silently fail after failover',
    High: 'Rate limiter drops legitimate API bursts',
    Medium: 'Deprecation warning is missing from the changelog',
    Low: 'Unsubscribe link wraps oddly in plain text',
  },
  {
    Critical: 'Release pipeline is blocked for every service',
    High: 'Third-party quota checks fail intermittently',
    Medium: 'Staging deploys run 12 minutes slower',
    Low: 'Error page copy has a double space',
  },
  {
    Critical: 'Annual plans are double-charged',
    High: 'Sandbox is unavailable for new trials',
    Medium: 'Password reset emails are delayed 20 minutes',
    Low: 'Feature flag tooltip has a typo',
  },
  {
    Critical: 'Webhook signatures fail verification for all partners',
    High: 'OAuth token refresh fails for desktop clients',
    Medium: 'Report downloads are slow for large accounts',
    Low: 'Marketing site favicon is missing',
  },
  {
    Critical: 'Object storage returns 403 for US-East',
    High: 'Audit log entries are missing actor names',
    Medium: 'Metrics pipeline drops samples',
    Low: 'Changelog page links to a 404',
  },
  {
    Critical: 'SSH bastion rejects every key',
    High: 'Emailed reports attach the wrong CSV',
    Medium: 'CI runners evict queued jobs',
    Low: 'Status page shows a stale incident timestamp',
  },
  {
    Critical: 'API gateway returns 429 for all callers',
    High: 'Idle sessions are not reaped',
    Medium: 'Search index falls behind after restarts',
    Low: 'Onboarding checklist has a broken icon',
  },
];
function rankFields(b: number, i: number) {
  return { s: (3 * i + b + 1) % 4, d: (3 * i + b + 2) % 4, m: (3 * i + b + 3) % 4 };
}
function rankRecords(b: number): Rec[] {
  return rankIds.map((id, i) => {
    const f = rankFields(b, i),
      sev = rankSevWords[f.s],
      desc = (rankBodies[b] as any)[sev];
    return { id, value: `${sev}: ${desc}. Reported ${rankDates[f.d]}. Estimated impact ${rankImpacts[f.m]}.` };
  });
}
function rankOrder(b: number, key: string): string[] {
  return rankIds
    .map((id, i) => ({ id, ...rankFields(b, i) }))
    .toSorted((x, y) => (key === 'severity' ? x.s - y.s : key === 'recency' ? x.d - y.d : x.m - y.m))
    .map((x) => x.id);
}

// --- GROUP: 10 bodies x 3 instructions -------------------------------------
// Each record independently names a component, a severity class and an environment, so the
// three grouping axes yield three distinct, defensible partitions (component/severity/env are
// de-correlated by construction). Partitions are derived from the assignment, not guessed.
const groupInstructions = [
  { key: 'component', text: 'Group the records by affected component.' },
  { key: 'severityClass', text: 'Group the records by severity class: fatal, recoverable, or informational.' },
  { key: 'environment', text: 'Group the records by environment: production, staging, or local.' },
];
const sevWords = ['Fatal', 'Recoverable', 'Informational'];
const envWords = ['production', 'staging', 'local'];
// ids a..f get a (component index 1-3, severity index 0-2, environment index 0-2); the three
// axes are arranged so each produces a different partition of {a..f}.
const groupAssign = [
  { c: 1, s: 0, e: 0 },
  { c: 1, s: 1, e: 1 },
  { c: 2, s: 2, e: 1 },
  { c: 2, s: 0, e: 2 },
  { c: 3, s: 1, e: 2 },
  { c: 3, s: 2, e: 0 },
];
interface GroupBody {
  components: [string, string, string];
  descriptions: string[];
}
const groupBodies: GroupBody[] = [
  {
    components: ['payments', 'search', 'auth'],
    descriptions: [
      'crashes on checkout',
      'is slow to apply tax rules',
      'logs a deprecation warning',
      'fails to start the indexer',
      'refreshes tokens slowly',
      'emits a version note',
    ],
  },
  {
    components: ['database', 'cache', 'queue'],
    descriptions: [
      'exhausts the connection pool',
      'shows elevated replica lag',
      'logs an eviction count',
      'fails to allocate the store',
      'shows elevated consumer lag',
      'reports an empty batch',
    ],
  },
  {
    components: ['web frontend', 'asset pipeline', 'cron scheduler'],
    descriptions: [
      'serves 500s on upload',
      'renders slowly on large pages',
      'logs a minify duration',
      'crashes on a bad source map',
      'skips a job during overlap',
      'records a missed window',
    ],
  },
  {
    components: ['billing', 'invoice', 'receipt'],
    descriptions: [
      'double-charges annual plans',
      'retries failed charges',
      'logs a render duration',
      'fails to generate a PDF',
      'writes receipts with delay',
      'notes a locale fallback',
    ],
  },
  {
    components: ['auth', 'session store', 'audit trail'],
    descriptions: [
      'rejects every token',
      'slows MFA challenges',
      'logs an eviction count',
      'corrupts the session file',
      'truncates old events slowly',
      'records a duplicate key',
    ],
  },
  {
    components: ['messaging broker', 'notification', 'webhook dispatcher'],
    descriptions: [
      'loses messages',
      'lags on partition rebalance',
      'logs a batch size',
      'fails to render templates',
      'drops attachments',
      'records an empty payload',
    ],
  },
  {
    components: ['object store', 'image service', 'thumbnailer'],
    descriptions: [
      'denies all writes',
      'returns slow reads',
      'logs a resize duration',
      'fails to decode a source',
      'caches stale thumbnails',
      'records a zero-byte source',
    ],
  },
  {
    components: ['api gateway', 'rate limiter', 'edge cache'],
    descriptions: [
      'drops requests',
      'miscounts retries',
      'logs a bucket count',
      'under-throttles callers',
      'serves stale responses',
      'records a TTL override',
    ],
  },
  {
    components: ['dns resolver', 'load balancer', 'ingress'],
    descriptions: [
      'returns NXDOMAIN for internal hosts',
      'caches stale records',
      'logs a health check flap',
      'reuses drained nodes',
      'times out on upstream',
      'records a retry',
    ],
  },
  {
    components: ['job runner', 'report generator', 'backup agent'],
    descriptions: [
      'skips scheduled tasks',
      'deadlocks on lock contention',
      'logs a page count',
      'fails to load a datasource',
      'writes deltas slowly',
      'records a skipped file',
    ],
  },
];
const groupIds = ['a', 'b', 'c', 'd', 'e', 'f'];
function groupPartition(key: string): string[][] {
  const groups = new Map<number, string[]>();
  groupAssign.forEach((a, i) => {
    const k = key === 'component' ? a.c - 1 : key === 'severityClass' ? a.s : a.e;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(groupIds[i]);
  });
  return [...groups.values()];
}

// --- REDUCE: 10 bodies x 3 instructions ------------------------------------
interface ReduceBody {
  records: Rec[];
  summarize: Fact;
  themes: Fact;
  facts: Fact;
}
interface Fact {
  mustContain: string[];
  mustNotContain: string[];
}
const reduceInstructions = [
  { key: 'summarize', text: 'Summarize the recurring failures and their supporting evidence.' },
  { key: 'themes', text: 'Summarize the top themes and cite the records that support them.' },
  { key: 'facts', text: 'Summarize the confirmed facts and separately flag anything uncertain.' },
];
// Resolution assertions a correct "confirmed facts" summary must not make (nothing was resolved).
const resolvedClaims = ['has been resolved', 'was fixed', 'has been fixed', 'we fixed', 'deployed a fix'];
const reduceBodies: ReduceBody[] = [
  {
    records: [
      { id: 'a', value: 'web-01: connection timed out to database at 02:11.' },
      { id: 'b', value: 'web-02: connection timed out to database at 02:13.' },
      { id: 'c', value: 'web-01: connection timed out to database at 02:17.' },
      { id: 'd', value: 'pay-01: payment gateway returned 502 at 02:20.' },
      { id: 'e', value: 'web-01: health check OK at 02:25.' },
    ],
    summarize: {
      mustContain: ['timeout|timed out', 'database', 'recurring', '502'],
      mustNotContain: ['migrated', 'DDoS', 'deployed a fix', 'rebooted'],
    },
    themes: { mustContain: ['database', 'payment'], mustNotContain: ['migrated', 'DDoS'] },
    facts: { mustContain: ['timeout|timed out', '502', '02:2'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'orders-svc: segmentation fault during peak at 18:40.' },
      { id: 'b', value: 'orders-svc: segmentation fault during peak at 18:42.' },
      { id: 'c', value: 'orders-svc: segmentation fault during peak at 18:45.' },
      { id: 'd', value: 'cart-svc: out-of-memory kill at 18:50.' },
      { id: 'e', value: 'orders-svc: normal response at 18:55.' },
    ],
    summarize: {
      mustContain: ['segmentation fault', 'recurring', 'out-of-memory'],
      mustNotContain: ['released a fix', 'patched', 'rolled back'],
    },
    themes: { mustContain: ['orders', 'cart', 'memory'], mustNotContain: ['patched'] },
    facts: { mustContain: ['segmentation fault', '18:4'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'auth-svc: LDAP timeout at 09:05.' },
      { id: 'b', value: 'auth-svc: LDAP timeout at 09:07.' },
      { id: 'c', value: 'auth-svc: LDAP timeout at 09:12.' },
      { id: 'd', value: 'auth-svc: certificate expiry warning at 09:30.' },
      { id: 'e', value: 'auth-svc: login OK at 09:45.' },
    ],
    summarize: {
      mustContain: ['LDAP', 'timeout', 'certificate'],
      mustNotContain: ['disabled MFA', 'changed the password policy', 'restarted the domain'],
    },
    themes: { mustContain: ['LDAP', 'certificate'], mustNotContain: ['disabled'] },
    facts: { mustContain: ['LDAP', 'timeout', 'expiry'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'queue: dead-letter pileup of 3,000 messages at 12:00.' },
      { id: 'b', value: 'queue: consumer lag at 4 minutes at 12:05.' },
      { id: 'c', value: 'queue: dead-letter pileup grew to 4,200 at 12:10.' },
      { id: 'd', value: 'worker: failed to deserialize payload at 12:20.' },
      { id: 'e', value: 'queue: drained normally at 12:30.' },
    ],
    summarize: {
      mustContain: ['dead-letter', 'pileup|backlog|accumulat', 'deserial'],
      mustNotContain: ['reprocessed all', 'cleared the queue', 'deployed'],
    },
    themes: { mustContain: ['queue', 'worker|consumer|deserial'], mustNotContain: ['cleared the queue'] },
    facts: { mustContain: ['3,000', '4,200', 'deserial'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'db-01: write latency spike to 900ms at 01:00.' },
      { id: 'b', value: 'db-01: write latency spike to 1,100ms at 01:05.' },
      { id: 'c', value: 'db-01: replication lag of 45 seconds at 01:10.' },
      { id: 'd', value: 'db-01: lock contention on the audit table at 01:15.' },
      { id: 'e', value: 'db-01: latency back to 40ms at 01:30.' },
    ],
    summarize: {
      mustContain: ['latency', 'replication', 'lock'],
      mustNotContain: ['added an index', 'sharded', 'upgraded the database'],
    },
    themes: { mustContain: ['latency', 'replication', 'lock'], mustNotContain: ['index'] },
    facts: { mustContain: ['900', '45', 'lock'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'cache-01: eviction storm at 14:00.' },
      { id: 'b', value: 'cache-01: eviction storm at 14:02.' },
      { id: 'c', value: 'cache-01: eviction storm at 14:04.' },
      { id: 'd', value: 'cache-02: keyspace notification flood at 14:10.' },
      { id: 'e', value: 'cache-01: hit rate restored at 14:20.' },
    ],
    summarize: {
      mustContain: ['eviction storm', 'recurring', 'keyspace'],
      mustNotContain: ['resized the cluster', 'cleared the cache', 'redeployed'],
    },
    themes: { mustContain: ['eviction', 'keyspace'], mustNotContain: ['resized'] },
    facts: { mustContain: ['eviction storm', '14:0'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 's3-proxy: 403 forbidden on GET at 07:00.' },
      { id: 'b', value: 's3-proxy: 403 forbidden on GET at 07:01.' },
      { id: 'c', value: 's3-proxy: 403 forbidden on GET at 07:03.' },
      { id: 'd', value: 's3-proxy: 500 on multipart upload at 07:15.' },
      { id: 'e', value: 's3-proxy: 200 OK at 07:20.' },
    ],
    summarize: {
      mustContain: ['403', 'forbidden', 'multipart'],
      mustNotContain: ['rotated the access keys', 'changed the bucket policy', 'revoked credentials'],
    },
    themes: { mustContain: ['403', 'upload'], mustNotContain: ['rotated'] },
    facts: { mustContain: ['403', '500', '07:0'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'nginx-01: upstream connection reset at 22:00.' },
      { id: 'b', value: 'nginx-01: upstream connection reset at 22:01.' },
      { id: 'c', value: 'nginx-01: upstream connection reset at 22:03.' },
      { id: 'd', value: 'nginx-02: worker process segfault at 22:12.' },
      { id: 'e', value: 'nginx-01: 200 OK at 22:18.' },
    ],
    summarize: {
      mustContain: ['upstream', 'reset', 'segfault|segmentation fault'],
      mustNotContain: ['upgraded nginx', 'changed the timeout', 'deployed a config'],
    },
    themes: { mustContain: ['upstream', 'segfault|segmentation fault'], mustNotContain: ['upgraded'] },
    facts: { mustContain: ['connection reset', 'segfault|segmentation fault', '22:0'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'kafka-01: partition under-replicated at 05:00.' },
      { id: 'b', value: 'kafka-01: consumer rebalance storm at 05:05.' },
      { id: 'c', value: 'kafka-01: partition under-replicated at 05:10.' },
      { id: 'd', value: 'kafka-02: producer timeout at 05:15.' },
      { id: 'e', value: 'kafka-01: ISR restored at 05:25.' },
    ],
    summarize: {
      mustContain: ['under-replicat|replicat', 'rebalance', 'producer'],
      mustNotContain: ['added brokers', 'reassigned partitions', 'increased the replication factor'],
    },
    themes: { mustContain: ['replication', 'rebalance'], mustNotContain: ['added brokers'] },
    facts: { mustContain: ['under-replicat|replicat', 'rebalance', '05:0'], mustNotContain: resolvedClaims },
  },
  {
    records: [
      { id: 'a', value: 'prometheus-01: scrape target down for node-exporter at 03:00.' },
      { id: 'b', value: 'prometheus-01: scrape target down for node-exporter at 03:05.' },
      { id: 'c', value: 'prometheus-01: scrape target down for node-exporter at 03:10.' },
      { id: 'd', value: 'prometheus-02: rules evaluation timeout at 03:20.' },
      { id: 'e', value: 'prometheus-01: target back up at 03:30.' },
    ],
    summarize: {
      mustContain: ['scrape', 'down|unavailab', 'evaluation timeout'],
      mustNotContain: ['increased the scrape interval', 'restarted prometheus', 'changed the retention'],
    },
    themes: { mustContain: ['scrape', 'evaluation'], mustNotContain: ['changed the scrape interval'] },
    facts: { mustContain: ['scrape', 'timeout', '03:0'], mustNotContain: resolvedClaims },
  },
];

// --- COMPARE: 10 bodies x 3 focus instructions -----------------------------
interface CompareBody {
  left: string;
  right: string;
  diffs: CompareFact;
  similarities: CompareFact;
  impact: CompareFact;
}
interface CompareFact {
  leftOnly: string[];
  rightOnly: string[];
  mustNotContain: string[];
}
const compareInstructions = [
  { key: 'diffs', text: 'What changed between the two files?' },
  { key: 'similarities', text: 'What do the two files still share?' },
  { key: 'impact', text: 'How does the change affect customer impact?' },
];
const compareBodies: CompareBody[] = [
  {
    left: 'database connection timeout is set to 5 seconds in production configuration.',
    right: 'database connection timeout is set to 30 seconds in production configuration.',
    diffs: {
      leftOnly: ['5 seconds'],
      rightOnly: ['30 seconds'],
      mustNotContain: ['both files set the timeout to 30 seconds', 'both files set the timeout to 5 seconds'],
    },
    similarities: { leftOnly: ['timeout'], rightOnly: ['timeout'], mustNotContain: [] },
    impact: { leftOnly: ['5 seconds'], rightOnly: ['30 seconds'], mustNotContain: ['both files set 30 seconds'] },
  },
  {
    left: 'The retry budget allows three attempts before the request fails.',
    right: 'The retry budget allows one attempt before the request fails.',
    diffs: {
      leftOnly: ['three attempts'],
      rightOnly: ['one attempt'],
      mustNotContain: ['both allow one attempt', 'both allow three attempts'],
    },
    similarities: { leftOnly: ['retry budget'], rightOnly: ['retry budget'], mustNotContain: [] },
    impact: { leftOnly: ['three'], rightOnly: ['one'], mustNotContain: ['both allow one attempt'] },
  },
  {
    left: 'Cache TTL is 3600 seconds and eviction is least-recently-used.',
    right: 'Cache TTL is 600 seconds and eviction is least-recently-used.',
    diffs: {
      leftOnly: ['3600'],
      rightOnly: ['600'],
      mustNotContain: ['both files set the TTL to 600', 'both files set the TTL to 3600'],
    },
    similarities: { leftOnly: ['least-recently-used'], rightOnly: ['least-recently-used'], mustNotContain: [] },
    impact: { leftOnly: ['3600'], rightOnly: ['600'], mustNotContain: ['both set 600 seconds'] },
  },
  {
    left: 'Worker concurrency is capped at 4 with a queue depth limit of 1000.',
    right: 'Worker concurrency is capped at 8 with a queue depth limit of 1000.',
    diffs: {
      leftOnly: ['4'],
      rightOnly: ['8'],
      mustNotContain: ['both cap concurrency at 8', 'both cap concurrency at 4'],
    },
    similarities: { leftOnly: ['queue depth limit'], rightOnly: ['queue depth limit'], mustNotContain: [] },
    impact: { leftOnly: ['4'], rightOnly: ['8'], mustNotContain: ['both cap at 8'] },
  },
  {
    left: 'The API requires an API key and permits 100 requests per minute.',
    right: 'The API requires an API key and permits 1000 requests per minute.',
    diffs: {
      leftOnly: ['100'],
      rightOnly: ['1000'],
      mustNotContain: ['both permit 1000 requests', 'both permit 100 requests'],
    },
    similarities: { leftOnly: ['API key'], rightOnly: ['API key'], mustNotContain: [] },
    impact: { leftOnly: ['100'], rightOnly: ['1000'], mustNotContain: ['both permit 1000'] },
  },
  {
    left: 'Log level is set to debug with sampling disabled.',
    right: 'Log level is set to error with sampling disabled.',
    diffs: {
      leftOnly: ['debug'],
      rightOnly: ['error'],
      mustNotContain: ['both files set the level to error', 'both files set the level to debug'],
    },
    similarities: { leftOnly: ['sampling disabled'], rightOnly: ['sampling disabled'], mustNotContain: [] },
    impact: { leftOnly: ['debug'], rightOnly: ['error'], mustNotContain: ['both set error'] },
  },
  {
    left: 'The deploy runs a blue/green rollout with no downtime.',
    right: 'The deploy runs an in-place rollout with no downtime.',
    diffs: {
      leftOnly: ['blue/green'],
      rightOnly: ['in-place'],
      mustNotContain: ['both files use blue/green', 'both files use in-place'],
    },
    similarities: { leftOnly: ['no downtime'], rightOnly: ['no downtime'], mustNotContain: [] },
    impact: { leftOnly: ['blue/green'], rightOnly: ['in-place'], mustNotContain: ['both use blue/green'] },
  },
  {
    left: 'Encryption uses AES-256 with a rotation period of 30 days.',
    right: 'Encryption uses AES-256 with a rotation period of 90 days.',
    diffs: {
      leftOnly: ['30 days'],
      rightOnly: ['90 days'],
      mustNotContain: ['both rotate keys every 90 days', 'both rotate keys every 30 days'],
    },
    similarities: { leftOnly: ['AES-256'], rightOnly: ['AES-256'], mustNotContain: [] },
    impact: { leftOnly: ['30 days'], rightOnly: ['90 days'], mustNotContain: ['both rotate every 90 days'] },
  },
  {
    left: 'Rate limiting applies to authenticated users at 500 requests per hour.',
    right: 'Rate limiting applies to anonymous users at 500 requests per hour.',
    diffs: {
      leftOnly: ['authenticated'],
      rightOnly: ['anonymous'],
      mustNotContain: ['both files limit anonymous users', 'both files limit authenticated users'],
    },
    similarities: { leftOnly: ['500 requests per hour'], rightOnly: ['500 requests per hour'], mustNotContain: [] },
    impact: { leftOnly: ['authenticated'], rightOnly: ['anonymous'], mustNotContain: ['both limit anonymous'] },
  },
  {
    left: 'The service binds to port 8080 with keepalive enabled.',
    right: 'The service binds to port 8443 with keepalive enabled.',
    diffs: { leftOnly: ['8080'], rightOnly: ['8443'], mustNotContain: ['both bind to 8443', 'both bind to 8080'] },
    similarities: { leftOnly: ['keepalive'], rightOnly: ['keepalive'], mustNotContain: [] },
    impact: { leftOnly: ['8080'], rightOnly: ['8443'], mustNotContain: ['both bind to 8443'] },
  },
];

// --- EXPLAIN: 30 unique inputs ---------------------------------------------
interface ExplainBody {
  input: string;
  audience: string;
  focus?: string;
  mustContain: string[];
  mustNotContain: string[];
  forbid?: string[];
}
const executionClaims = ['I ran', 'I executed', 'I applied', 'I deployed', 'I fixed', 'I rebooted'];
const explainBodies: ExplainBody[] = [
  {
    input: "TypeError: Cannot read properties of undefined (reading 'map')",
    audience: 'developer',
    mustContain: ['undefined', 'map'],
    mustNotContain: [...executionClaims, 'null pointer'],
    forbid: [],
  },
  {
    input: 'panic: runtime error: index out of range [5] with length 3',
    audience: 'developer',
    mustContain: ['index', 'range', 'length'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'Connection refused (ECONNREFUSED) 127.0.0.1:5432',
    audience: 'developer',
    mustContain: ['refused', '5432'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'git rebase -i HEAD~4',
    audience: 'developer',
    mustContain: ['rebase', 'last four', 'interactive'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'SELECT name, COUNT(*) FROM orders GROUP BY name HAVING COUNT(*) > 1',
    audience: 'developer',
    mustContain: ['orders', 'duplicate|appear more than once|more than once', 'group'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: "df -h | awk '$5+0 > 80'",
    audience: 'developer',
    mustContain: ['disk usage', '80', 'awk'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'kubectl rollout status deployment/api --timeout=120s',
    audience: 'developer',
    mustContain: ['rollout', 'deployment', 'timeout'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: '^\\s*([a-z]+):\\s*(.+)$',
    audience: 'developer',
    mustContain: ['key', 'colon', 'value', 'group'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'chmod 644 report.txt',
    audience: 'developer',
    mustContain: ['permissions', 'read', 'write'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'docker compose up -d --build',
    audience: 'developer',
    mustContain: ['build', 'detached', 'containers'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'MemoryError: out of memory (limit 512MiB)',
    audience: 'non-technical',
    mustContain: ['memory', 'exhausted|used up|out of'],
    mustNotContain: executionClaims,
    forbid: ['stack trace', 'heap', 'allocat', 'garbage collect', 'pointer'],
  },
  {
    input: 'TimeoutError: The request exceeded the 30 second limit.',
    audience: 'non-technical',
    mustContain: ['30 seconds|thirty seconds', 'too long|in time', 'time'],
    mustNotContain: executionClaims,
    forbid: ['HTTP', 'endpoint', 'socket', 'gateway'],
  },
  {
    input: '404 Not Found: GET /api/v2/customers/88',
    audience: 'non-technical',
    mustContain: ['not found', 'missing'],
    mustNotContain: executionClaims,
    forbid: ['route', 'endpoint', 'REST', 'GET'],
  },
  {
    input: 'SSL certificate verify failed: self-signed certificate',
    audience: 'non-technical',
    mustContain: ['certificate', 'trust'],
    mustNotContain: executionClaims,
    forbid: ['handshake', 'X.509', 'TLS'],
  },
  {
    input: 'rm -rf ./node_modules',
    audience: 'non-technical',
    mustContain: ['delete', 'dependencies', 'folder'],
    mustNotContain: executionClaims,
    forbid: ['recursive', 'inode', 'glob'],
  },
  {
    input: 'git bisect start HEAD v1.2.0',
    audience: 'developer',
    mustContain: ['bisect', 'binary search', 'regression|bug was introduced|broke|introduced'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'openssl x509 -in cert.pem -noout -text',
    audience: 'developer',
    mustContain: ['certificate', 'inspect|read|print|verify', 'text'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: "awk -F',' '{sum += $3} END {print sum}'",
    audience: 'developer',
    mustContain: ['comma', 'third field', 'sum'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'ssh -L 5432:localhost:5432 user@bastion',
    audience: 'developer',
    mustContain: ['tunnel', 'forward', 'port'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'systemctl status nginx.service',
    audience: 'developer',
    mustContain: ['status', 'nginx', 'service'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'fatal: refusing to merge unrelated histories',
    audience: 'developer',
    mustContain: ['merge', 'unrelated', 'histories'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: "ValueError: invalid literal for int() with base 10: 'abc'",
    audience: 'developer',
    mustContain: ['convert|conversion|casting', 'string', 'integer', 'abc'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'jq \'.[] | select(.status == "failed") | .id\'',
    audience: 'developer',
    mustContain: ['filter', 'failed', 'id'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'tar -czf archive.tar.gz src/ docs/',
    audience: 'developer',
    mustContain: ['compress', 'archive', 'gzip'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: "ps aux | grep java | awk '{print $2}'",
    audience: 'developer',
    mustContain: ['process', 'java', 'pid'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'The database disk image is malformed',
    audience: 'non-technical',
    mustContain: ['database', 'damaged|corrupt|errors|unreadable|broken'],
    mustNotContain: executionClaims,
    forbid: ['B-tree', 'SQLite', 'vacuum', 'schema'],
  },
  {
    input: 'Insufficient storage space to complete this operation',
    audience: 'non-technical',
    mustContain: ['storage', 'full', 'space'],
    mustNotContain: executionClaims,
    forbid: ['inode', 'filesystem', 'allocation'],
  },
  {
    input: 'git revert --no-commit HEAD',
    audience: 'developer',
    mustContain: ['revert', 'commit', 'no commit|no-commit|without creating a new commit'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: 'curl -sI https://example.com/health',
    audience: 'developer',
    mustContain: ['headers', 'status', 'health'],
    mustNotContain: executionClaims,
    forbid: [],
  },
  {
    input: "redis-cli --scan --pattern 'session:*' | head -20",
    audience: 'developer',
    mustContain: ['scan', 'pattern', 'session'],
    mustNotContain: executionClaims,
    forbid: [],
  },
];

// ---------------------------------------------------------------------------

for (let b = 0; b < rankBodies.length; b++) {
  const orders = rankInstructions.map((i) => rankOrder(b, i.key).join(','));
  if (new Set(orders).size !== 3 || orders.includes('a,b,c,d'))
    throw new Error(`Rank body ${b} has ambiguous or input-order answers`);
}
const out: any[] = [];
let idx = 0;
const devLimit = 2; // first two bodies per family are development
rankBodies.forEach((body, b) => {
  const records = rankRecords(b);
  rankInstructions.forEach((inst) => {
    out.push({
      id: `rank-${idx}`,
      split: b < devLimit ? 'development' : 'held-out',
      command: 'rank',
      args: { instruction: inst.text },
      input: { kind: 'records', records },
      rubric: rubric('rank'),
      expected: { order: rankOrder(b, inst.key) },
    });
    idx++;
  });
});
idx = 0;
groupBodies.forEach((body, b) => {
  const records = groupAssign.map((a, i) => ({
    id: groupIds[i],
    value: `${sevWords[a.s]}: ${body.components[a.c - 1]} ${body.descriptions[i]} in ${envWords[a.e]}.`,
  }));
  groupInstructions.forEach((inst) => {
    out.push({
      id: `group-${idx}`,
      split: b < devLimit ? 'development' : 'held-out',
      command: 'group',
      args: { instruction: inst.text },
      input: { kind: 'records', records },
      rubric: rubric('group'),
      expected: { partition: groupPartition(inst.key) },
    });
    idx++;
  });
});
idx = 0;
reduceBodies.forEach((body, b) => {
  reduceInstructions.forEach((inst) => {
    out.push({
      id: `reduce-${idx}`,
      split: b < devLimit ? 'development' : 'held-out',
      command: 'reduce',
      args: { instruction: inst.text, strategy: 'direct' },
      input: { kind: 'records', records: body.records },
      rubric: rubric('reduce'),
      expected: (body as any)[inst.key] as Fact,
    });
    idx++;
  });
});
idx = 0;
compareBodies.forEach((body, b) => {
  compareInstructions.forEach((inst) => {
    const fact = (body as any)[inst.key] as CompareFact;
    out.push({
      id: `compare-${idx}`,
      split: b < devLimit ? 'development' : 'held-out',
      command: 'compare',
      args: { focus: inst.text },
      input: { kind: 'compare', left: body.left, right: body.right },
      rubric: rubric('compare'),
      expected: { leftOnly: fact.leftOnly, rightOnly: fact.rightOnly, mustNotContain: fact.mustNotContain },
    });
    idx++;
  });
});
idx = 0;
explainBodies.forEach((body, b) => {
  out.push({
    id: `explain-${idx}`,
    split: b < 6 ? 'development' : 'held-out',
    command: 'explain',
    args: { focus: body.focus ?? 'overall meaning', audience: body.audience },
    input: { kind: 'text', value: body.input },
    rubric: rubric('explain'),
    expected: {
      mustContain: body.mustContain,
      mustNotContain: body.mustNotContain,
      forbid: body.forbid?.length ? body.forbid : undefined,
    },
  });
  idx++;
});

if (out.length !== 150 || new Set(out.map((c) => c.id)).size !== 150)
  throw new Error('Expected 150 unique rubric cases');
await writeFile('evals/datasets/rubric-cases.json', JSON.stringify(out, null, 2) + '\n');
console.log(`Generated ${cases.length} core and ${out.length} rubric cases; reviewer audit remains required`);
