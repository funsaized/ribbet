# CLI-01 — ACCEPTED 2026-09-14

See [checkpoint](CHECKPOINT-20260914.md). Linux, Bun 1.4.0.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Conflicting args-json/flags fail before inference | PASS | `tests/cli/parser.test.ts` |
| Unknown args point to schema path | PASS | parser location `args.*` |
| Stdout stays clean | PASS | `tests/cli/baseline.test.ts`, pipelines |
| No TTY prompt in CI | PASS | setup/doctor JSON, no prompt path |

`npm run test:cli` 11 pass. Reviewer decision: ACCEPTED.
