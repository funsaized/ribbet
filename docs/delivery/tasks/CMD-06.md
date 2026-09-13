# CMD-06 — Ship deterministic projection and sequence helpers

## Outcome

Implement select, stable typed sort, exact unique with canonical JSON equality and streaming take. Declare barrier behavior for sort and memory accounting for unique.

## Parent and state

Parent: C18–C21. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/exact/; tests/exact/. Task-specific evidence under docs/delivery/evidence/CMD-06.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement select, stable typed sort, exact unique with canonical JSON equality and streaming take. Declare barrier behavior for sort and memory accounting for unique.

## Acceptance criteria

- Zero provider calls.
- Missing fields/mixed sort types explicit.
- Unique keeps first.
- Take zero does not consume upstream.

## Verification

Property tests for stable ordering/equality; 100k record stream; early termination; nested field errors. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
