# AGENT-03 — Run independent agent consumer evaluation

## Outcome

Run 10 bounded consumer tasks using packaged SDK/CLI and public docs only: reuse definitions, add typed logic, inspect routes, repair errors, compose flows. Use agents only when authorized in the implementation session.

## Parent and state

Parent: G6/R-PERF. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted AGENT-02; Accepted FLOW-03; Accepted CMD-01; Accepted CMD-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

evals/agent/; docs/delivery/evidence/AGENT-03.md. Task-specific evidence under docs/delivery/evidence/AGENT-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Run 10 bounded consumer tasks using packaged SDK/CLI and public docs only: reuse definitions, add typed logic, inspect routes, repair errors, compose flows. Use agents only when authorized in the implementation session.

## Acceptance criteria

- At least 8/10 meet rubrics.
- Failed attempts retained.
- No runtime internals supplied.
- No manual task-specific patch hidden as agent success.

## Verification

Record prompts, environment, tool calls, outputs, failures and reviewer scoring. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
