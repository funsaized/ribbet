// Deterministic normalizer for the 2018 Central Park Squirrel Census snapshot.
//
// The raw Socrata response is an array of rows in `:id` order. This projects a
// fixed set of fields, preserves absent values as absent (Socrata omits nulls),
// and adds a derived `has_note` / `note` / `note_source` used by the tutorial's
// exact `where` selection. It never reads or writes the network.
//
// Run directly:  bun examples/squirrel-report/normalize.ts RAW.json > squirrels.jsonl

export const FIELDS = [
  'unique_squirrel_id',
  'hectare',
  'shift',
  'date',
  'hectare_squirrel_number',
  'age',
  'primary_fur_color',
  'location',
  'running',
  'chasing',
  'climbing',
  'eating',
  'foraging',
  'approaches',
  'indifferent',
  'runs_from',
  'other_activities',
  'other_interactions',
  'x',
  'y',
] as const;

export type NormalizedRow = Record<string, unknown>;

function noteOf(row: Record<string, unknown>): { note: string; note_source: string } | null {
  for (const [field, source] of [
    ['other_activities', 'other_activities'],
    ['other_interactions', 'other_interactions'],
  ] as const) {
    const value = row[field];

    if (typeof value === 'string' && value.trim()) return { note: value, note_source: source };
  }

  return null;
}

/** Normalize one raw dataset row. Throws on a row without a string identifier. */
export function normalizeRow(row: unknown): NormalizedRow {
  if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error('Row must be a JSON object');
  const raw = row as Record<string, unknown>;

  if (typeof raw.unique_squirrel_id !== 'string' || !raw.unique_squirrel_id)
    throw new Error('Row is missing unique_squirrel_id');

  const normalized: NormalizedRow = {};

  for (const field of FIELDS)
    if (Object.hasOwn(raw, field)) {
      const value = raw[field];

      normalized[field] =
        ['running', 'chasing', 'climbing', 'eating', 'foraging', 'approaches', 'indifferent', 'runs_from'].includes(
          field,
        ) && typeof value === 'string'
          ? value === 'true'
            ? true
            : value === 'false'
              ? false
              : value
          : value;
    }
  const note = noteOf(raw);

  normalized.has_note = note !== null;
  if (note) {
    normalized.note = note.note;
    normalized.note_source = note.note_source;
  }

  return normalized;
}

/** Normalize a full snapshot in input order. */
export function normalize(rows: unknown): NormalizedRow[] {
  if (!Array.isArray(rows)) throw new Error('Snapshot must be a JSON array');

  return rows.map(normalizeRow);
}

/** Deterministically pick the first `count` rows that carry a written note. */
export function sampleNotes(rows: NormalizedRow[], count = 8): NormalizedRow[] {
  return rows.filter((row) => row.has_note).slice(0, count);
}

/** Exact population counts computed from the normalized snapshot, never from a model. */
export function summarize(rows: NormalizedRow[]) {
  const activityFields = [
    'running',
    'chasing',
    'climbing',
    'eating',
    'foraging',
    'approaches',
    'indifferent',
    'runs_from',
  ] as const;
  const ids = rows.map((row) => row.unique_squirrel_id);
  const seen = new Map<unknown, number>();

  for (const id of ids) seen.set(id, (seen.get(id) ?? 0) + 1);
  const duplicateIds = [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => ({ id, count: n }));

  return {
    total: rows.length,
    distinctUniqueSquirrelIds: seen.size,
    duplicateIdGroups: duplicateIds.length,
    activityNotes: rows.filter((row) => row.note_source === 'other_activities').length,
    interactionNotes: rows.filter((row) => row.note_source === 'other_interactions').length,
    noteRows: rows.filter((row) => row.has_note).length,
    missingAge: rows.filter((row) => !Object.hasOwn(row, 'age')).length,
    activities: Object.fromEntries(
      activityFields.map((field) => [field, rows.filter((row) => row[field] === true).length]),
    ),
  };
}

export function toJsonl(rows: NormalizedRow[]): string {
  return rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : '');
}

if (import.meta.main) {
  const path = Bun.argv[2];

  if (!path) {
    console.error('usage: bun examples/squirrel-report/normalize.ts RAW.json');
    process.exit(2);
  }
  const rows = normalize(await Bun.file(path).json());

  process.stdout.write(toJsonl(rows));
}
