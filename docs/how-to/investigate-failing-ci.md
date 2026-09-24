# Investigate a failing CI check

This is a **controlled offline regression**, not a published failing branch. The [provenance](../../fixtures/tutorials/failing-ci/PROVENANCE.md) identifies the constructed diff, log, source excerpt, and exact expected failure signature. No commit or workflow URL exists yet. The installed, healthy `ribbit` investigates the broken source excerpt; it does not execute or patch that source.

Install `ribbit` and configure a `stronger` object-capable profile using [model setup](configure-models.md). npm installation supplies the executable, **not** this repository's example files. Clone `https://github.com/funsaized/ribbit`, pin a reviewed revision, and from that checkout run:

```sh
mkdir -p ci-investigation/commands
cp -R fixtures/tutorials/failing-ci/. ci-investigation/
cp examples/commands/diagnose-ci.yaml ci-investigation/commands/
cp examples/flows/diagnose-ci.yaml ci-investigation/diagnose-ci.yaml
cd ci-investigation
ribbit read ci.log changes.diff src/builtins/exact.ts tests/release/projection.test.fixture --output records > evidence.records
```

**Expected output:** `evidence.records` starts with the v1 record header and contains four records with source paths. Check the exit status before accepting the file; a valid prefix can precede failure. Inspect `ci.log` for `(fail) projection keeps annotations after classify`, and compare the diff's `yield { id: r.id, value }` with the parent `yield { ...r, value }`.

The command definition refers to `diagnose.schema.json`, already copied into the working directory. Interpret the **saved** evidence first:

```sh
ribbit run diagnose-ci --input records --file evidence.records --profile stronger > diagnosis.json
```

**Required properties:** the JSON has `failureSignature`, `observations`, `hypotheses`, `sources`, `likelyChange`, and `nextChecks`; cited paths and lines must exist in the saved evidence. This is a schema/format check, not a guarantee that the diagnosis is correct. Model prose varies; no captured live model answer is supplied. Examine the proposed change location yourself. The fixture's known failure is annotation/source loss on projection, not an arbitrary nonzero exit.

Once that pipeline makes sense, run the equivalent named flow from the same directory:

```sh
ribbit flow plan diagnose-ci.yaml
ribbit flow run diagnose-ci.yaml --output json > flow-diagnosis.json
```

**Expected output:** the plan shows one exact `read` and one model `diagnose-ci` stage on `stronger`. **Required properties:** successful exit, same six JSON fields, source-backed references. The flow shares a request budget; separate shell processes do not. stdout is data, stderr is diagnostics. Keep `evidence.records`, the fixture's diff/log, and the output for review. The `.fixture` suffix prevents the constructed reproduction from running in routine CI; a future broken checkout would install it as `tests/release/projection.test.ts` and run `bun test tests/release/projection.test.ts` after explicit branch authorization. Do not confuse that checkout with the healthy installed investigator. No branch or workflow is published yet.
