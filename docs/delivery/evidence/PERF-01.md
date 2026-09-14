# PERF-01 — ACCEPTED 2026-09-14

Both platform artifacts rebuilt from one tree and measured in place. No threshold changed.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Ratified p95/RSS budgets pass | PASS | see table |
| Exact commands make zero inference calls | PASS | empty capabilities; `take` bench |
| No benchmark regression hidden by altered workload | PASS | same 30-sample warm method, 100k records |

| Gate | Linux | macOS |
| --- | --- | --- |
| help/version p95 ≤100 ms | 38.7 / 38.4 | 30.6 / 29.8 |
| extension invocation p95 ≤150 ms | 121.4 | 80.9 |
| managed pre-HTTP p95 ≤100 ms | 66.2 | 48.4 |
| 100k take incremental RSS ≤128 MiB | 42936 KiB | not measured (gate is Linux reference) |

Artifacts: Linux `b23e33cf84064f3285486fa9c9079df074011a07f4c4565a797a02975aa6fc36`; macOS `a9227bf8e914c0b523302a62dda45849d875362808e46322799ab3e7694345ea`. Raw: `benchmarks/latest.json`, `invocation-linux.json`, `invocation-darwin.json`, `docs/delivery/evidence/core-stream-memory.json`. Method: `docs/performance.md`.

Reviewer decision: ACCEPTED.
