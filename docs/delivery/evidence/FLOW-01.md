# FLOW-01 — ACCEPTED 2026-09-14

| Criterion | Result | Evidence |
| --- | --- | --- |
| Definition cannot shadow built-in silently | PASS | reserved name `take` rejected |
| Exact type version validated | PASS | typeVersion 9.0.0 code 3 |
| Invocation override does not mutate YAML | PASS | CLI 3 vs default 2; file unchanged |
| Schema errors include paths | PASS | YAML/definition locations |

Named help includes type/action/defaults. Reviewer decision: ACCEPTED.
