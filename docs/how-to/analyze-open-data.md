# What were the squirrels up to?

The [2018 Central Park Squirrel Census](https://data.cityofnewyork.us/resource/vfnx-vebw.json) is attributed to [The Squirrel Census](https://www.thesquirrelcensus.com/). Its portal metadata declares no license; review the [NYC terms](https://www.nyc.gov/main/terms-of-use) before redistributing a snapshot. The four-row [offline sample](../../fixtures/tutorials/squirrels/sample.json) is synthetic, not the population. Counts below are computed against that sample; never extrapolate the eight-note interpretation to all squirrels.

You need Bun for the small normalization/verification scripts, `ribbit` installed on PATH, and configured `local-small` object-capable model for interpretation. For live acquisition you also need `curl`, `jq`, and `sha256sum` or `shasum`. npm installation does not include example files: clone `https://github.com/funsaized/ribbit` at a reviewed revision to get `examples/squirrel-report/`, `examples/flows/squirrel-report.yaml`, and the sample. Start at the checkout root.

```sh
bun examples/squirrel-report/normalize.ts fixtures/tutorials/squirrels/sample.json > squirrels.jsonl
ribbit where has_note --args-json '{"equals":true}' --input jsonl --file squirrels.jsonl --output records > noted.records
```

**Expected output:** four normalized rows; `noted.records` has the v1 header and three rows, with independent row IDs despite duplicate `unique_squirrel_id` values. Inspect `age: null` versus absent `age`, and the retained activity flags. The [normalizer](../../examples/squirrel-report/normalize.ts) computes exact counts; use it on a frozen snapshot, not a model answer.

For a live snapshot, run `bash examples/squirrel-report/acquire.sh squirrels.raw.json`; save its checksum and retrieval date with the raw bytes. The script requests ordered `:id` pages with a six-page cap. Pages are **not** transactional; recheck counts/IDs on the frozen response. Then normalize `squirrels.raw.json` in place of the sample above. Do not substitute `unique_squirrel_id` for the row ID; duplicates exist in the live dataset.

Select a deterministic bounded sample, retain it, then annotate without replacing original values:

```sh
ribbit take 8 --input records --file noted.records --output records > sample.records
ribbit map 'Extract one observation; quote an admitted note verbatim.' \
  --annotate observation --schema examples/squirrel-report/observations.schema.json \
  --input records --file sample.records --profile local-small --max-requests 32 --total-ms 120000 \
  --output records > annotated.records
```

**Required properties:** `observation` holds a schema-constrained behavior, human-involvement flag, and quote; `value`, ID and source remain unchanged. The entire original record, including both note fields and activity flags, reaches the model. The supplied sample makes three requests; eight live notes can consume up to 32 requests with repairs/retries. Use `--max-requests 32` for that worst case (or reduce the sample), and allow sufficient total time. Provider timeout/size limits still apply. Check exit status before accepting a partial stream. Do not claim a quote is real merely because it matches a JSON schema; verify it against the admitted originals.

The equivalent flow consumes the normalized record stream and shares one invocation budget:

```sh
ribbit flow run examples/flows/squirrel-report.yaml --input jsonl --file squirrels.jsonl \
  --max-requests 32 --total-ms 120000 --output records > flow-observations.records
```

**Required properties:** exact `where` selects nonempty notes, `take` caps eight, and annotation-mode `map` preserves originals. A field report may use an explicitly routed `reduce` on **only the saved sample**, then cite admitted IDs and verbatim quotations; verify it with `bun examples/squirrel-report/verify-report.ts report.md sample.records`. Keep raw response, normalized JSONL, sampled records, annotations, report, and its stderr separately. The offline test checks reference/quote membership and exact sample counts; no captured model prose is presented as a deterministic expected output.

Produce the report with code, not a model-generated total. The reporter rejects quotations absent from their cited notes and keeps population counts separate from the small qualitative sample:

```sh
bun examples/squirrel-report/report.ts squirrels.jsonl annotated.records > report.md
bun examples/squirrel-report/verify-report.ts report.md sample.records
```

**Expected output:** for the supplied four-row synthetic sample, `report.md` says `Population: 4 captured rows` and cites three admitted IDs. The verifier reports three references. **Required properties:** the captured-row totals come from exact arithmetic; no quoted text is accepted solely because a schema matched. If you instead write a model-synthesized report using `reduce`, verify that output the same way and retain both versions.
