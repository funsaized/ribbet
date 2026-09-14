# DOCS-02 — ACCEPTED 2026-09-14

Verified against both packaged binaries. Depends on SHIP-01 (ACCEPTED).

| Criterion | Result | Evidence |
| --- | --- | --- |
| No prose-only imaginary flags | PASS | `docs-examples.ts` passed on Linux and macOS |
| 22-command coverage table complete | PASS | `commands list --json` length 22 on Linux and macOS |
| Accessible plain output and terminal examples usable | PASS | packaged `take`/`flow run`/`render` examples pass on both |

Linux: `npm run test:docs` (links + packaged examples). macOS: `bun scripts/docs-examples.ts` against `dist/ribbit-darwin-arm64`. Reviewer decision: ACCEPTED.
