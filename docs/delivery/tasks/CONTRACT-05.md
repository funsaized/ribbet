# CONTRACT-05 — Ratify measurable release gates

## Outcome

Name reference hardware/OS, measurement methodology, quality rubrics and dataset ownership. Ratify numeric PRD targets or record an explicit alternative before optimization work. Define candidate model evaluation process.

## Parent and state

Parent: G7/G8; R-PERF. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/release.md; evals/specs/. Task-specific evidence under docs/delivery/evidence/CONTRACT-05.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Name reference hardware/OS, measurement methodology, quality rubrics and dataset ownership. Ratify numeric PRD targets or record an explicit alternative before optimization work. Define candidate model evaluation process.

## Acceptance criteria

- No benchmark claims without raw evidence.
- Dataset leakage and repair results tracked.
- Required pilot is clearly owner-arranged.
- Release-ready and published are distinct.

## Verification

Reviewer checks each gate has metric, threshold, environment, task owner and artifact. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
