# SHIP-01 — ACCEPTED 2026-09-14

Both target artifacts rebuilt from one tree; macOS verified on the Apple M1 machine.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Fresh machines run help and deterministic tools without a compiler | PASS | macOS `--help`/`--version`/`commands list --json` (22) and `docs-examples.ts` |
| Installed extension works offline after build | PASS | macOS `extensions scaffold/check/test` passed; smoke on Linux |
| No public publishing triggered | PASS | private `dist/` only |

Artifacts: Linux `dist/ribbit` SHA-256 `b23e33cf84064f3285486fa9c9079df074011a07f4c4565a797a02975aa6fc36`; macOS `dist/ribbit-darwin-arm64` SHA-256 `a9227bf8e914c0b523302a62dda45849d875362808e46322799ab3e7694345ea`. Linux `TMPDIR=... npm run package:smoke` passed. macOS layout requires the SDK `lib/` beside the executable as `dist/lib/` (discovered and corrected during verification).

Reviewer decision: ACCEPTED.
