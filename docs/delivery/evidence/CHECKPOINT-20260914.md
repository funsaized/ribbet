# Checkpoint — 2026-09-14

Audit findings closed; both platform artifacts rebuilt from one tree and measured in place. Not a release: EVAL-02 and the human pilot gate remain open.

## Verification (Linux x86_64, Ryzen 9 5900XT, Bun 1.4.0; macOS Apple M1)

`TMPDIR` on disk because `/tmp` tmpfs returned EDQUOT.

| Command | Result |
| --- | --- |
| `npm run check` | PASS |
| `TMPDIR=... npm run test:unit` | 107 pass |
| `TMPDIR=... npm run test:cli` | 11 pass |
| `npm run test:consumer` | 1 pass |
| `TMPDIR=... npm run test:conformance` | 2 pass |
| `npm run test:docs` | PASS |
| `npm run build` | PASS (Linux + Darwin) |
| `TMPDIR=... npm run package:smoke` | PASS |
| `python3 scripts/picker-smoke.py` | PASS select + cancel 130 |
| macOS `bun scripts/docs-examples.ts` | PASS |
| macOS `extensions scaffold/check/test` | PASS |
| macOS `bench-invocation.ts` | extension 80.9 ms, managed 48.4 ms |
| Live semantic eval | Full run interrupted at 9/750 (owner stop) |
| Rubric-family eval | NOT RUN (`scripts/evaluate-rubrics.ts` ready) |

## Artifacts (same revision)

- Linux `dist/ribbit` SHA-256 `b23e33cf84064f3285486fa9c9079df074011a07f4c4565a797a02975aa6fc36`
- macOS `dist/ribbit-darwin-arm64` SHA-256 `a9227bf8e914c0b523302a62dda45849d875362808e46322799ab3e7694345ea`

## Perf gates

| Gate | Linux | macOS |
| --- | --- | --- |
| help/version p95 ≤100 ms | 38.7 / 38.4 | 30.6 / 29.8 |
| extension p95 ≤150 ms | 121.4 | 80.9 |
| managed pre-HTTP p95 ≤100 ms | 66.2 | 48.4 |
| 100k take incremental RSS ≤128 MiB | 42936 KiB | n/a (Linux reference) |

## Semantics

Full held-out runs: 0.5B `.332/.524/.749`; 1.5B `.855/.651/.984` (pre label-prompt fix) and `.333/.444/.987` (current code). Development-split screens only: gemma-4-e4b `.944/.867/.400`, 27B `1/1/1`. No passing default.

## Still not release

EVAL-02 (no passing model), PILOT-01 (owner-arranged humans), PROV-04 (PROV-03 waiver), RELEASE-01/02.
