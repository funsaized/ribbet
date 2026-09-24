import { summarize, type NormalizedRow } from './normalize.ts';
import { recordNotes, verifyReport, type AdmittedRecord } from './verify-report.ts';

export function report(
  population: NormalizedRow[],
  sample: (AdmittedRecord & { annotations: Record<string, unknown> })[],
) {
  const counts = summarize(population);
  const lines = [
    '# Squirrel field report',
    '',
    `Population: ${counts.total} captured rows; ${counts.distinctUniqueSquirrelIds} distinct dataset IDs; ${counts.duplicateIdGroups} duplicate ID groups; ${counts.noteRows} rows with notes.`,
    `Activity flags (exact captured-row counts): ${Object.entries(counts.activities)
      .map(([name, count]) => `${name} ${count}`)
      .join(', ')}.`,
    '',
    `## Qualitative observations (only ${sample.length} selected notes; not population estimates)`,
  ];

  for (const row of sample) {
    const observation = row.annotations.observation as
      | { behavior?: unknown; human_involvement?: unknown; quote?: unknown }
      | undefined;

    if (
      !observation ||
      typeof observation.quote !== 'string' ||
      /["\r\n]/.test(observation.quote) ||
      !recordNotes(row).some((note) => note.includes(observation.quote as string)) ||
      typeof observation.behavior !== 'string' ||
      typeof observation.human_involvement !== 'boolean'
    )
      throw new Error(`Unsupported observation for record ${row.id}`);
    lines.push(
      `- [${row.id}] ${observation.behavior}, human involvement ${observation.human_involvement}: "${observation.quote}"`,
    );
  }
  const result = lines.join('\n') + '\n';
  const issues = sample.length ? verifyReport(result, sample) : [];

  if (issues.length) throw new Error(issues.join('; '));

  return result;
}

if (import.meta.main) {
  const [populationPath, samplePath] = Bun.argv.slice(2);

  if (!populationPath || !samplePath) {
    console.error('usage: bun examples/squirrel-report/report.ts NORMALIZED.jsonl ANNOTATED.records');
    process.exit(2);
  }
  const parseLines = (text: string) =>
    text
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  const population = parseLines(await Bun.file(populationPath).text()) as NormalizedRow[];
  const sample = parseLines(await Bun.file(samplePath).text()).filter(
    (row) => typeof row.id === 'string',
  ) as (AdmittedRecord & { annotations: Record<string, unknown> })[];

  process.stdout.write(report(population, sample));
}
