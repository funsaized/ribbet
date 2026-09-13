# CMD-03 — Ship filter and map

## Outcome

Implement per-record decision/transform with bounded batching and concurrency. Preserve filter record bytes as data values; map emits one result with lineage.

## Parent and state

Parent: C07/C10. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/records/; tests/records-semantic/. Task-specific evidence under docs/delivery/evidence/CMD-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement per-record decision/transform with bounded batching and concurrency. Preserve filter record bytes as data values; map emits one result with lineage.

## Acceptance criteria

- Stable ordering under out-of-order HTTP completions.
- Filter cannot rewrite originals.
- Failures stop without fabricated records.
- Budgets cap work.

## Verification

Interleaved mock responses, false/true decisions, empty streams, one-to-one map, cancellation. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
