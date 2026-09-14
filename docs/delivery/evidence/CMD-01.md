# CMD-01 — ACCEPTED 2026-09-14

Mocked command behavior only. Live quality is EVAL-02.

| Criterion | Result | Evidence |
| --- | --- | --- |
| All four expose schema/help/examples | PASS | generated catalog/docs/commands.md |
| Exact requested max words enforced or explicit failure | PASS | `tests/builtins/commands.test.ts` summarize |
| Inputs treated as data | PASS | prompt wrapper + adversarial stdin |
| No shell actions | PASS | families template/hostile text |

Reviewer decision: ACCEPTED. Not a semantic-quality pass.
