# EXT-02 — Accepted

Integrator review, 2026-09-13. EXT-01, SDK-01 and CORE-02 accepted.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Built-ins and installed actions use shared dispatch | PASS | Both dispatch through executeAction; built-in and extension suites |
| Arbitrary exceptions sanitized | PASS | Error contains no supplied private marker |
| Stream cancellation and cleanup | PASS | Pending next rejects on abort; iterator return requested; early break closes generator |
| Output schema validated | PASS | SDK value and partial-stream invalid-output tests |

Verification: `bun test tests/extensions tests/sdk tests/execution`. Cancellation stops awaiting noncooperative async work; it cannot forcibly terminate arbitrary synchronous trusted TypeScript or undo its side effects. No such isolation is claimed.
