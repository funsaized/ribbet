# SDK-01 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b08ef6f plus foundation/engine/SDK changes.

Typed command SDK.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Postprocessing output validated | PASS | Invalid value and stream item fail exit 5 before emission |
| Defaults/optionals infer correctly | PASS | Strict compile test includes expected negative assignment |
| Consumer compiles without internals | PASS | tests/consumer/sdk.test.ts uses only src/sdk/index.ts |

`npm run check`, `npm run test:unit` (23 tests) and `npm run test:consumer` (1 public SDK consumer) exit 0. The consumer imports the SDK entry point only; packaging the SDK is a later task. Public defineAction carries config schema by reference; defineCommand requires every action to share that reference. This helper preserves generic inference without maintaining duplicate config definitions. Tests cover value/text-stream modes; record mode parses each input item and output item.

Integrator decision: accepted at this task scope. No provider conformance or release readiness claimed.
