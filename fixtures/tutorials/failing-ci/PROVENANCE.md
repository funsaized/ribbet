# Provenance: failing-CI diagnosis fixture

This directory is a **controlled offline fixture**. It is not a captured live
run, and no branch, commit SHA, or workflow run was published to reproduce it.
Everything here was constructed in the local repository so the tutorial and its
tests run without network access. Do not present any file below as an immutable
upstream artifact or link to a commit URL that does not exist.

## What it models

A branch built on the healthy contract implementation introduces one regression
at the projection/annotation boundary: `select` in `src/builtins/exact.ts`
returns `yield { id: r.id, value }` instead of `yield { ...r, value }`. That
drops the record `source` and `annotations` fields it previously carried. A
reproduction test that classifies records and then projects them fails because
the `classify` annotation no longer reaches the projected records.

The regression is deliberately a single line. A constructed log, a unified
diff, and the affected source are bundled so the diagnosis flow can separate
observations, hypotheses, source references, and next checks.

## Files and how they were made

| Fixture path | Form | Origin |
| --- | --- | --- |
| `ci.log` | illustrative log | Handwritten projection of the expected output-validation failure; only the test name/signature is asserted, not an actual captured CI run |
| `changes.diff` | unified diff | Constructed from the prospective one-line change at the projection yield |
| `src/builtins/exact.ts` | bounded source (lines 1-105) | `sed -n '1,105p' src/builtins/exact.ts`, then the one regression line at 101 |
| `tests/release/projection.test.fixture` | reduced test sketch | Intentionally not discovered by routine Bun tests; the constructed log depicts it as `projection.test.ts` on a future broken checkout |
| `failure-signature.txt` | expected signature | The exact `(fail)` line a controlled check must match; not merely a nonzero exit status |
| `diagnose.schema.json` | extraction schema | Author-written; the structured fields the flow must return |

The source excerpt was based on this repository's `src/builtins/exact.ts`
lines 1-105. The deliberate change is the yield at line 101; formatting can
also differ from the current working tree. Inspect the semantic change with:

```sh
diff <(sed -n '1,105p' src/builtins/exact.ts) fixtures/tutorials/failing-ci/src/builtins/exact.ts
```

Do not treat a nonzero `diff` exit status as a reproduction test. This fixture is released under the
same MIT license as the rest of the repository; no third-party code is
redistributed.

## Reproduction boundary

The fixture describes a broken checkout but never runs it. Diagnosis uses the
healthy installed `ribbit` from `PATH`. To reproduce the failure itself you
would check out the branch and run its own development test command
(`bun test tests/release/projection.test.ts`, after copying the sketch to that path); every Ribbit command in the
tutorial uses the installed executable. There is no automatic patching.

Publishing the demonstration branch, its workflow, and the immutable
commit/workflow link is a **separate, explicitly authorized delivery step**.
Until that authorization exists, this fixture stands in for the captured
evidence and the recorded link is intentionally absent.
