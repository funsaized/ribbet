# Investigate a failing CI check

The [healthy parent](https://github.com/funsaized/ribbit/commit/4824aac91a3b2a3bd42ffd7e84850ff709960eaf) passes the regression test. The one-line [broken demo commit](https://github.com/funsaized/ribbit/commit/736583fd7a27dd9090ea3ebef358d864dcc3b256) fails in a [dedicated workflow run](https://github.com/funsaized/ribbit/actions/runs/36018875927). See [evidence provenance](../../fixtures/tutorials/failing-ci/PROVENANCE.md) for excerpt boundaries. The installed, healthy `ribbit` investigates the broken source; it does not execute or patch that source.

Install `ribbit` and configure a `stronger` object-capable profile using [model setup](configure-models.md). npm installation supplies the executable, **not** this repository's example files. Obtain the saved assets from the demo branch and record the checkout SHA for reproducibility. The broken branch is **only an evidence source**; all `ribbit` commands below resolve the installed executable on PATH:

```sh
git clone --branch demo/failing-ci-projection https://github.com/funsaized/ribbit.git ribbit-evidence
cd ribbit-evidence
git checkout fa32d61a23849b9419c2e29292dc1ad72ac4ea10
git rev-parse HEAD
```

From that checkout run:

```sh
mkdir -p ci-investigation/commands
cp -R fixtures/tutorials/failing-ci/. ci-investigation/
cp examples/commands/diagnose-ci.yaml ci-investigation/commands/
cp examples/flows/diagnose-ci.yaml ci-investigation/diagnose-ci.yaml
cd ci-investigation
ribbit read ci.log changes.diff src/builtins/exact.ts tests/release/projection-baseline.test.fixture --output records > evidence.records
```

**Expected output:** `evidence.records` starts with the v1 record header and contains four records with source paths. Check the exit status before accepting the file; a valid prefix can precede failure. Inspect the captured `ci.log` for `(fail) projection keeps annotations after classify` and the missing `annotations` path; compare the diff's `yield { id: r.id, value }` with the parent's `yield { ...r, value }`. The source excerpt labels original line 113.

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

**Expected output:** the plan shows one exact `read` and one model `diagnose-ci` stage on `stronger`. **Required properties:** successful exit, same six JSON fields, source-backed references. The flow shares a request budget; separate shell processes do not. stdout is data, stderr is diagnostics. Keep `evidence.records`, the captured diff/log, and the output for review. To reproduce the failure in the deliberately broken checkout, use its development test command `bun test tests/release/projection-baseline.test.ts`. All investigation commands use the installed healthy `ribbit` from PATH. The `.fixture` suffix only prevents the offline evidence copy of the test from running in routine tests; no patch is applied automatically.
