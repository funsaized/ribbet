# Ribbit — private launch decision packet

Private. Owner-facing. Do not publish, distribute or link publicly.

Candidate: `ribbit-private` `0.1.0-dev.0`, revision `77a56c75cb3304b0ca2fced577c7a6b9dbfcf6df`
(binary built from source revision `629a1dc`; later commits are docs/benchmarks only).
Prepared for the owner's publication decision. Publication is a separate action and
remains pending explicit instruction.

## 1. What ships

A local-first semantic shell toolkit: 22 built-in commands (`ask`, `classify`, `compare`,
`explain`, `extract`, `filter`, `find`, `group`, `ls`, `map`, `pick`, `rank`, `read`,
`reduce`, `render`, `rewrite`, `select`, `sort`, `summarize`, `take`, `tree`, `unique`),
typed extensions, named YAML commands and linear flows. No telemetry, no automatic cloud
fallback, no runtime downloads for ordinary use.

## 2. Install artifacts

| Platform | File | SHA-256 | Notes |
| --- | --- | --- | --- |
| Linux x86_64 | `dist/ribbit` | `322cadd9d7b3e33e733a0d40573592c4bd933b20470f8b72a1dd3fa5aac3bf28` | Reproducible: two builds gave the same hash. |
| macOS arm64 | `dist/ribbit-darwin-arm64` | `e0abc053fb108d1efaae81c6061250f1eff42652255a3e2c7995cae073cbd579` unsigned; `52dd197bc2804e12f679d6805f73a9a9687d7d3d458466e927dae91ad0aad813` after ad-hoc `codesign` | **Signing required**: the unsigned binary is killed by macOS (exit 137). |

Build: `npm ci --ignore-scripts && npm run build` (Linux); macOS via
`RIBBIT_BUILD_TARGET=bun-darwin-arm64` cross-compile then `codesign`. Each artifact needs a
sibling `dist/lib/` directory (SDK/type support for extension authoring). The distribution
is not committed (`dist/` is git-ignored); rebuild from the revision above.

## 3. Measured results (all at the candidate)

- **Verification suite**: `check`, `lint`, `format:check`, `test:unit` 117, `test:consumer` 1,
  `test:cli` 11, `test:conformance` 2, `build`, `package:smoke`, `test:docs` — all exit 0.
- **Performance** (p95): Linux help 42.2 / version 39.6 / extension 119.8 / managed 66.3 ms,
  100k incremental RSS 106.8 MiB; macOS help 30.2 / version 29.6 / extension 80.6 /
  managed 46.6 ms. All gates pass.
- **Semantic eval** (`gemma-4-e4b`, 3 runs): filter macro-F1 1.000, classify 1.000,
  extraction field correctness 0.919; both gates pass every run.
- **Rubric families**: deterministic 97.8 / 100 / 100 / 100 / 91.1 % and independent reviewer
  100 / 100 / 100 / 100 / 90.0 % for rank / group / reduce / compare / explain; all ≥ 85 %.
- **Setup pilot**: 1/1 owner-run first-run in 271 s excluding download (multi-user waived).

Full detail: `docs/delivery/evidence/` (`RELEASE-01`, `EVAL-02`, `PERF-01`, `PILOT-01`),
`docs/models.md`, `docs/performance.md`.

## 4. Known limits

- macOS arm64 distribution requires signing; only ad-hoc signing was done locally.
  Developer ID signing and notarization are not performed.
- 100k incremental RSS measured 106.8 MiB at the candidate versus 42.9 MiB recorded in
  PERF-01 (2026-09-14). Both under the 128 MiB gate; the difference is unexplained.
- Evals are synthetic and single-machine; semantic/rubric evidence was measured at `504eec4`
  (whitespace-only delta to the candidate). `gemma-4-e4b` leaks jargon for non-technical
  `--audience` and occasionally inverts rank when severity is de-correlated from impact.
- EVAL-02's reviewer pass is an independent AI reviewer, not a human.
- The setup pilot is a single owner participant (owner-waived scope).
- The larger local option (Qwen3.8 27B) is not fully evaluated and needs > 12 GiB VRAM.
- Extensions are trusted executable code; no sandbox. Windows and Linux arm64 are follow-up.
- One concurrent local inference request; content caching off; no telemetry.

## 5. Unresolved owner decisions

- **Name and domain**: naming/domain validation remain separate owner tasks.
- **Licensing**: no `LICENSE` file; dependency licenses (zod, yaml, ajv, ignore, typescript,
  oxlint/oxfmt, @stylistic) and model licenses (`gemma-4-e4b`, Qwen) are undecided as a set.
- **Versioning**: `0.1.0-dev.0` is a development version; a `1.0.0` decision is pending.
- **Signing/notarization** for any public distribution.
- **Publication channel**: repository visibility, package registry, or site.

## 6. Decision requested

Approve this candidate for **private, release-ready** status (RELEASE-02 acceptance).
Publication — making the repo/package/site public, outreach, or credential creation —
remains a separate explicit instruction and is not covered by this packet.
