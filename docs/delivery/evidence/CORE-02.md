# CORE-02 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b08ef6f plus foundation/engine/SDK changes.

Shared execution budgets, cancellation and backpressure.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Take cancels upstream | PASS | Zero reads for take 0; no extra pull for take 3 |
| Ctrl-C aborts HTTP/runtime work | PASS | AbortSignal forwarded to provider callback; shell SIGINT wiring remains CLI-01 |
| Context/byte limits explicit | PASS | Finite tokens/bytes/records and deadlines throw exit 6 |
| Timeout and repair budgets shared | PASS | Every attempted request enters one Budget |

Seven focused lifecycle tests plus the adapter suite. `npm run check` and `npm run test:unit` exit 0. `bun run scripts/stream-memory.ts` exits 0: 100,000 records, 35,392 KiB incremental peak RSS (single Linux sample; not release PERF-01). Tests verify take zero, exact early closure, request/total deadlines, external cancellation, shared retry/repair request accounting, bytes/tokens, bounded validated emission and expected EPIPE. Initial strict test typing failure was corrected before rerun.

Integrator decision: accepted at this task scope. No provider conformance or release readiness claimed.
