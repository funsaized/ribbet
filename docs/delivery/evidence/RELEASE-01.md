# RELEASE-01 — REVIEW 2026-09-16

Audit of complete initial scope and release evidence. Candidate revision:
`629a1dc468d00109ae52fb285b4d6ccd042f573f`. Linux artifact `dist/ribbit` SHA-256
`322cadd9d7b3e33e733a0d40573592c4bd933b20470f8b72a1dd3fa5aac3bf28` (reproducible: two
builds produced the same hash).

| Criterion | Result | Evidence |
| --- | --- | --- |
| No required task missing or unverified gate counted as passed | PASS | Backlog dependency audit: 50 required rows, 48 ACCEPTED, RELEASE-01 is this task, RELEASE-02 blocked on it. No other required task is unaccepted. |
| All 22 commands map to tests/docs | PASS | `commands list --json` = 22; every command has a `## <name>` section in `docs/commands.md` and test coverage; `pick` is covered by `scripts/picker-smoke.py`. |
| Routing/SDK contracts match shipped schema | PASS | Generated `src/generated/catalog.json` is reproducible (a build leaves no diff); routing, SDK, manifest and consumer suites pass. |
| Full verification suite at the candidate | PASS | `check`, `lint`, `format:check`, `test:unit` (117), `test:consumer` (1), `test:cli` (11), `test:conformance` (2), `build`, `package:smoke`, `test:docs` — all exit 0. |
| Fresh package artifacts and evidence refer to same revision | **UNVERIFIED (macOS)** | Linux artifact is fresh at the candidate and Linux perf was re-measured; eval/pilot evidence is at `504eec4`, which differs from the candidate only in whitespace/docs/config (no real code change — see below). The **macOS artifact `a9227bf8…` and macOS timing evidence are from 2026-09-14** and were not re-measured here (Linux-only host). |
| Risks and unverified items disclosed | PASS | See below. |

## Verification commands at `629a1dc`

| Command | Exit | Result |
| --- | --- | --- |
| `npm run check` | 0 | TypeScript clean |
| `npm run lint` | 0 | 0 warnings, 0 errors |
| `npm run format:check` | 0 | All matched files formatted |
| `npm run test:unit` | 0 | 117 pass, 0 fail |
| `npm run test:consumer` | 0 | 1 pass |
| `npm run test:cli` | 0 | 11 pass |
| `npm run test:conformance` | 0 | 2 pass |
| `npm run build` | 0 | Linux CLI compiled |
| `npm run package:smoke` | 0 | Installed CLI + extension authoring smoke |
| `npm run test:docs` | 0 | Links + packaged deterministic examples |

## Performance re-measured at the candidate (Linux)

| Gate | Measured | Threshold |
| --- | --- | --- |
| help p95 | 42.2 ms | ≤ 100 ms |
| version p95 | 39.6 ms | ≤ 100 ms |
| extension p95 | 119.8 ms | ≤ 150 ms |
| managed pre-HTTP p95 | 66.3 ms | ≤ 100 ms |
| 100k take incremental RSS | 112,017,408 B (106.8 MiB) | ≤ 128 MiB |

Raw: `benchmarks/latest.json`, `benchmarks/invocation-linux.json`, `scripts/stream-bench.py`.

## Evidence/revision delta

`git diff -w --ignore-blank-lines 504eec4..HEAD -- src scripts tests ':(exclude)src/generated'`
is **empty**: between the eval/pilot measurement revision and the candidate there is no
real code change (only whitespace, blank lines, docs and the generated catalog hash).
Eval and pilot evidence therefore apply to the candidate.

## Known limits and unverified items

- macOS artifact and timing evidence are from 2026-09-14, not the candidate revision, and
  were not re-measured (Linux-only host).
- The 100k incremental RSS measured 106.8 MiB at the candidate versus 42.9 MiB recorded in
  PERF-01 (2026-09-14). Both are under the 128 MiB gate; the difference was not investigated.
- Semantic eval and pilot evidence were measured at `504eec4` (behavioral no-op delta above).
- Model quality is measured on synthetic, single-machine fixtures with cross-split overlap;
  `gemma-4-e4b` leaks jargon for non-technical `--audience` and shows occasional rank
  inversion when severity is de-correlated from impact.
- EVAL-02's reviewer pass is an independent AI reviewer, not a human.
- PILOT-01 is a single owner participant under an owner-waived scope.

## Blocker / open decision

RELEASE-01 cannot be ACCEPTED while the criterion "fresh artifacts and evidence refer to
same revision" is unmet for macOS. Resolve by one of:

1. Re-measure macOS help/version/extension/managed on the M1 at a revision with zero real
   code delta from the candidate, record it, and refresh the macOS artifact; or
2. The owner explicitly revises the criterion to a Linux-reference or revision-delta policy.

RELEASE-02 remains blocked pending this decision.

Reviewer decision: **REVIEW**.
