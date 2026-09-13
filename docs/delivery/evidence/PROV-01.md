# PROV-01 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b5ba67d plus routing and provider changes in this commit.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Text streaming/object share cancellation and stats | PASS | Six managed inference tests; shared Budget; real loopback HTTP cancellation |
| Missing usage stays unknown | PASS | Missing completion usage marks unknown; no fabricated token counts |
| No hidden fallback/tools | PASS | Adapter identity retained through retry; refusal/tool events reject |

`npm run check` and `bun test tests/providers` passed. Final full unit suite has 68
passing tests. `npm run test:conformance` passed its one real loopback HTTP abort test
with authorized local socket access. These are implementation checks, not full QA-01.

One schema-repair attempt maximum; one transport retry maximum for 429/5xx before
any text. All attempts enter the same serial Budget, including repairs. Shorter route
timeouts are honored. Input/schema byte and conservative context bounds fail before
transport; output bytes are bounded. Reported token usage is checked for finite
nonnegative integers and charged; unavailable usage is recorded unknown.

An early-break review found the streaming handoff needed explicit acknowledgement
in finally; corrected and added a regression proving no deadlock and producer closure.
Streaming retains bounded response text for accounting/retry safety; it does not claim
zero-buffer execution. SDK help/manifests and CLI wiring remain later tasks.

Scope amendment: shared schema preflight lives under engine/inference; shared HTTP
transport/parser lives under providers/http for both adapters rather than duplicated
implementations. Public command scope is unchanged.

Integrator decision: accepted.
