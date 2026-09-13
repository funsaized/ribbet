# PILOT-01 — Validate first-run and recurring use cases with owner-selected users

## Outcome

Owner arranges five private pilot sessions; observe local setup and at least one signature workflow, record download time separately and identify blockers. Do not contact anyone without authorization.

## Parent and state

Parent: G8/R-PERF. Class: Required human evidence. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DOCS-02; Accepted EVAL-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/evidence/PILOT-01.md; anonymized observations. Task-specific evidence under docs/delivery/evidence/PILOT-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Owner arranges five private pilot sessions; observe local setup and at least one signature workflow, record download time separately and identify blockers. Do not contact anyone without authorization.

## Acceptance criteria

- At least 4/5 meet setup target excluding download.
- Evidence is real users, not simulations.
- Blockers enter tracked tasks.

## Verification

Timestamped observation rubric, environment and user feedback; no private identifiers needed. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
