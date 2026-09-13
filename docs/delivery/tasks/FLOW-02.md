# FLOW-02 — Implement typed linear flow planner

## Outcome

Parse linear steps/references and inline :: syntax, validate references and detectable schema mismatches, resolve step routes and declare streaming/barrier boundaries.

## Parent and state

Parent: G3/R-FLOW. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FLOW-01; Accepted CONTRACT-04

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/flows/plan/; tests/flows/plan/. Task-specific evidence under docs/delivery/evidence/FLOW-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Parse linear steps/references and inline :: syntax, validate references and detectable schema mismatches, resolve step routes and declare streaming/barrier boundaries.

## Acceptance criteria

- Plan performs no model call or extension import.
- Future/missing refs rejected.
- Force-profile visible.
- Quoted prompt content preserved.

## Verification

Flow contract fixture suite; route plan snapshots; payload argument quoting cases. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
