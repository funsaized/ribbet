# ROUTE-01 — Implement configuration and route resolver

## Outcome

Load global/project config with explicit paths, named providers/profiles and per-command rules. Implement the ratified precedence table and field provenance.

## Parent and state

Parent: G4/R-ROUTE. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BUILD-01; Accepted CONTRACT-03

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/config/; src/routing/; tests/routing/. Task-specific evidence under docs/delivery/evidence/ROUTE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Load global/project config with explicit paths, named providers/profiles and per-command rules. Implement the ratified precedence table and field provenance.

## Acceptance criteria

- All routing contract fixtures pass.
- Profile resets and provider-only defaults behave consistently.
- Unknown route returns error before input is sent.

## Verification

Full table-driven resolver suite including force-profile and invalid profile/model combinations. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
