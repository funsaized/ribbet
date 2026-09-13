# CORE-01 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b08ef6f plus the foundation, adapter and test changes.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Header/version locations | PASS | Explicit record and auto detection errors, line 1; malformed row and duplicate locations |
| Unterminated final line | PASS | Lines/JSONL/wire fixtures and CRLF preservation |
| Text bypasses detection | PASS | Exact header retained in explicit text mode |
| Identity/content round trip | PASS | UTF-8, multiline values, annotations and source metadata |

`npm run check` and `npm run test:unit` exited 0 (13 tests, including 12 adapter tests).
Initial typecheck found async-generator return calls missing an argument; corrected
to `return(undefined)` and reran the checks. Tests cover empty inputs, ordinary JSON
as literal auto text, nonfinite JSON, cycles, byte/record limits, malformed UTF-8,
metadata-dropping JSONL, and upstream closure without draining an infinite producer.
No provider behavior claimed. Tests live under tests/records as scoped; test:unit
includes that directory. Iterator identity tracking retains bounded IDs, not full
record values. Execution/output limits remain CORE-02 responsibility.

Integrator review: adapter criteria satisfied; accepted.
