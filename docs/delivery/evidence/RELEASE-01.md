# RELEASE-01 — ACCEPTED 2026-09-16

Audit of complete initial scope and release evidence. Candidate revision:
`629a1dc468d00109ae52fb285b4d6ccd042f573f`.

Artifacts at the candidate:

| Platform | Artifact | SHA-256 |
| --- | --- | --- |
| Linux | `dist/ribbit` | `322cadd9d7b3e33e733a0d40573592c4bd933b20470f8b72a1dd3fa5aac3bf28` (reproducible across two builds) |
| macOS arm64 | `dist/ribbit` cross-compiled (`--target bun-darwin-arm64`) | `e0abc053fb108d1efaae81c6061250f1eff42652255a3e2c7995cae073cbd579` unsigned; `52dd197bc2804e12f679d6805f73a9a9687d7d3d458466e927dae91ad0aad813` after ad-hoc `codesign` (the executed artifact) |

| Criterion | Result | Evidence |
| --- | --- | --- |
| No required task missing or unverified gate counted as passed | PASS | Backlog dependency audit: 50 required rows, 49 ACCEPTED, RELEASE-02 READY. No unaccepted required task remains. |
| All 22 commands map to tests/docs | PASS | `commands list --json` = 22; every command has a `## <name>` section in `docs/commands.md` and test coverage; `pick` via `scripts/picker-smoke.py`. |
| Routing/SDK contracts match shipped schema | PASS | Generated `src/generated/catalog.json` reproducible (a build leaves no diff); routing, SDK, manifest and consumer suites pass. |
| Full verification suite at the candidate | PASS | `check`, `lint`, `format:check`, `test:unit` (117), `test:consumer` (1), `test:cli` (11), `test:conformance` (2), `build`, `package:smoke`, `test:docs` — all exit 0. |
| Fresh package artifacts and evidence refer to same revision | PASS | Linux artifact + perf re-measured at the candidate. macOS artifact cross-compiled at the candidate, ad-hoc signed, and re-measured on the M1 (results below). Eval/pilot evidence is at `504eec4`, which differs from the candidate only in whitespace/docs/config (no real code change — see delta below), so it applies. |
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

## Performance re-measured at the candidate

| Gate | Linux (Ryzen 9 5900XT) | macOS (Apple M1) | Threshold |
| --- | --- | --- | --- |
| help p95 | 42.2 ms | 30.2 ms | ≤ 100 ms |
| version p95 | 39.6 ms | 29.6 ms | ≤ 100 ms |
| extension p95 | 119.8 ms | 80.6 ms | ≤ 150 ms |
| managed pre-HTTP p95 | 66.3 ms | 46.6 ms | ≤ 100 ms |
| 100k take incremental RSS | 112,017,408 B (106.8 MiB) | not measured (gate is Linux reference) | ≤ 128 MiB |

Raw: `benchmarks/latest.json`, `benchmarks/invocation-linux.json`,
`benchmarks/invocation-darwin.json`, `benchmarks/stream-linux.json`.

## Evidence/revision delta

`git diff -w --ignore-blank-lines 504eec4..HEAD -- src scripts tests ':(exclude)src/generated'`
is **empty**: between the eval/pilot measurement revision and the candidate there is no
real code change (only whitespace, blank lines, docs and the generated catalog hash).
Eval and pilot evidence therefore apply to the candidate.

## Known limits and unverified items

- macOS arm64 distribution **requires signing**: the unsigned cross-compiled binary is
  killed by the OS (exit 137). Ad-hoc `codesign --force --sign -` is sufficient locally;
  Developer ID signing/notarization is a publication concern.
- The 100k incremental RSS measured 106.8 MiB at the candidate versus 42.9 MiB recorded in
  PERF-01 (2026-09-14). Both are under the 128 MiB gate. **Cause identified, not a regression**: PERF-01's figure came from `scripts/stream-memory.ts` (engine in-process under `bun run`), while the candidate uses `scripts/stream-bench.py` (compiled `dist/ribbit` subprocess, `/proc` peak); re-running the old script at the candidate reproduces ≈41 MiB. `stream-bench.py` is the correct gate instrument because it measures the shipped artifact.
- Semantic eval and pilot evidence were measured at `504eec4` (behavioral no-op delta above).
- Model quality is measured on synthetic, single-machine fixtures with cross-split overlap;
  `gemma-4-e4b` leaks jargon for non-technical `--audience` and shows occasional rank
  inversion when severity is de-correlated from impact.
- EVAL-02's reviewer pass is an independent AI reviewer, not a human.
- PILOT-01 is a single owner participant under an owner-waived scope.

Reviewer decision: **ACCEPTED**. RELEASE-02 is READY.
