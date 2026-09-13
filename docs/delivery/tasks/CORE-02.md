# CORE-02 — Implement execution lifecycle and budgets

## Outcome

Build shared deadline/request/token/input limits, AbortSignal propagation, backpressure and validated emission. Distinguish record streaming from global barriers; no hidden buffering of infinite streams.

## Parent and state

Parent: R-DATA/R-PERF. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CORE-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/engine/execution/; tests/execution/. Task-specific evidence under docs/delivery/evidence/CORE-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Build shared deadline/request/token/input limits, AbortSignal propagation, backpressure and validated emission. Distinguish record streaming from global barriers; no hidden buffering of infinite streams.

## Acceptance criteria

- Take cancels upstream.
- Ctrl-C aborts HTTP and runtime work.
- Context/byte limits error explicitly.
- Timeout and repair attempts share budgets.

## Verification

Fake slow producer/provider; oversized input; cancellation; expected pipe close vs write failure; RSS check. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
