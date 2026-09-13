# PERF-01 — Measure and optimize runtime overhead

## Outcome

Measure CLI/extension startup, manifest discovery, stream RSS and provider-independent overhead. Optimize measured bottlenecks without changing contracts; record cold and warm separately.

## Parent and state

Parent: G7. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-05; Accepted FLOW-03; Accepted FS-05; Accepted CMD-06; Accepted CMD-07

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

benchmarks/; selected engine hot paths; docs/performance.md. Task-specific evidence under docs/delivery/evidence/PERF-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Measure CLI/extension startup, manifest discovery, stream RSS and provider-independent overhead. Optimize measured bottlenecks without changing contracts; record cold and warm separately.

## Acceptance criteria

- Ratified p95/RSS budgets pass.
- Exact commands make zero inference calls.
- No benchmark regression hidden by altered workload.

## Verification

Reproducible runner with repetitions, baseline/candidate diffs and raw samples. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
