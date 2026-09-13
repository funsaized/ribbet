# DECIDE-01 — Prove the runtime and distribution path

## Outcome

Compare at least two practical TS-capable execution/distribution options using a tiny typed extension, cached manifest lookup, streaming and cancellation. Include an installed binary prototype on both target platforms. Measure process startup separately from inference and justify one runtime.

## Parent and state

Parent: G2/G7; R-EXT/R-PERF. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BASE-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

spikes/runtime/; docs/decisions/runtime.md; evidence. Task-specific evidence under docs/delivery/evidence/DECIDE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Compare at least two practical TS-capable execution/distribution options using a tiny typed extension, cached manifest lookup, streaming and cancellation. Include an installed binary prototype on both target platforms. Measure process startup separately from inference and justify one runtime.

## Acceptance criteria

- Chosen runtime loads installed extensions without network.
- Schema discovery executes no extension code.
- Packaging supports macOS arm64/Linux x86_64.
- Latency/RSS and maintenance tradeoffs are recorded.
- Target changes require a documented decision.

## Verification

Repeated cold/warm startup measurements; executable extension fixture; no-network run; platform smoke evidence. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
