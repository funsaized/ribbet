// Checks that a squirrel field report only cites admitted record IDs and only
// quotes text that actually appears in those records' notes. A schema cannot
// verify quotations, so the tutorial runs this over the real report output.
//
// Run directly:  bun examples/squirrel-report/verify-report.ts report.md sample.records

export interface AdmittedRecord {
  id: string;
  value: Record<string, unknown>;
}

/** Collect the note text a record can legitimately quote from. */
export function recordNotes(record: AdmittedRecord): string[] {
  const value = record.value ?? {};
  const notes = [value.note, value.other_activities, value.other_interactions].filter(
    (note): note is string => typeof note === 'string' && note.length > 0,
  );

  return notes;
}

/** Return human-readable issues; an empty array means the report verified. */
export function verifyReport(report: string, records: AdmittedRecord[]): string[] {
  const issues: string[] = [];
  const byId = new Map(records.map((record) => [record.id, record]));
  const citedIds = [...report.matchAll(/\[([A-Za-z0-9_-]+)\]/g)].map((match) => match[1]);
  const quotes = [...report.matchAll(/"([^"\n]+)"|“([^”\n]+)”/g)];

  if (!citedIds.length) issues.push('Report cites no record IDs');
  if (!quotes.length) issues.push('Report contains no quotations');
  for (const reference of citedIds)
    if (!byId.has(reference)) issues.push(`Reference [${reference}] is not an admitted record ID`);
  for (const match of quotes) {
    const quote = match[1] ?? match[2];
    const line = report.slice(
      report.lastIndexOf('\n', match.index) + 1,
      report.indexOf('\n', match.index) < 0 ? undefined : report.indexOf('\n', match.index),
    );
    const cited = [...line.matchAll(/\[([A-Za-z0-9_-]+)\]/g)]
      .map((item) => byId.get(item[1]))
      .filter((record): record is AdmittedRecord => !!record);
    const admitted = cited.some((record) => recordNotes(record).some((note) => note.includes(quote)));

    if (!admitted) issues.push(`Quote is not present in a cited record's note: ${JSON.stringify(quote)}`);
  }

  return issues;
}

if (import.meta.main) {
  const [reportPath, recordsPath] = Bun.argv.slice(2);

  if (!reportPath || !recordsPath) {
    console.error('usage: bun examples/squirrel-report/verify-report.ts REPORT SAMPLE.records');
    process.exit(2);
  }
  const text = await Bun.file(reportPath).text();
  const records = (await Bun.file(recordsPath).text())
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as AdmittedRecord)
    .filter((row) => typeof row.id === 'string');
  const issues = verifyReport(text, records);

  if (issues.length) {
    console.error(issues.join('\n'));
    process.exit(4);
  }
  console.log(`verified ${references(text)} references against ${records.length} records`);
}

function references(text: string): number {
  return [...text.matchAll(/\[([A-Za-z0-9_-]+)\]/g)].length;
}
