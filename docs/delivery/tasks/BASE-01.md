# BASE-01 — Establish repository and delivery baseline

## Outcome

Record whether the implementation repository exists, its revision and dirty state, existing commands, environment, platform and tool availability. Map proposed paths to existing equivalents before coding. Record missing tools without installing them as part of this task.

## Parent and state

Parent: G1–G8. Class: Required. Initial state: **READY**. Current state: **ACCEPTED**. Current state is maintained in backlog.md.

## Prerequisites

None; this is the first assignment.

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/evidence/BASE-01.md; repository inventory only. Task-specific evidence under docs/delivery/evidence/BASE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Record whether the implementation repository exists, its revision and dirty state, existing commands, environment, platform and tool availability. Map proposed paths to existing equivalents before coding. Record missing tools without installing them as part of this task.

## Acceptance criteria

- A reviewer can distinguish pre-existing failures from introduced failures.
- Absent repository is explicitly greenfield, not inferred to contain code.
- Planning files are preserved.

## Verification

Read-only repository/environment inspection; record exact commands and statuses. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
