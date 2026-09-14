# CLI-02 — ACCEPTED 2026-09-14

See [checkpoint](CHECKPOINT-20260914.md).

| Criterion | Result | Evidence |
| --- | --- | --- |
| Works outside initialized repo | PASS | completions/help with isolated XDG |
| No inference/import during discovery | PASS | completions list manifests/YAML only |
| Named definitions show type/action and effective argument contract | PASS | `first --help` includes `@ribbit/take`, `Action: run`, defaults |

`tests/cli/audit-regressions.test.ts`. Reviewer decision: ACCEPTED.
