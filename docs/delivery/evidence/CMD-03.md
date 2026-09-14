# CMD-03 — ACCEPTED 2026-09-14

| Criterion | Result | Evidence |
| --- | --- | --- |
| Stable ordering under out-of-order HTTP completions | PASS | per-record sequential await, not completion order |
| Filter cannot rewrite originals | PASS | `tests/builtins/commands.test.ts` identity |
| Failures stop without fabricated records | PASS | invalid classify/filter errors |
| Budgets cap work | PASS | Budget.request / empty stream zero calls |

Reviewer decision: ACCEPTED.
