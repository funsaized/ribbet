# SDK-01 — Implement typed command SDK

## Outcome

Implement defineCommand/action generics, separate config/args/input/output validation, execution modes and contexts. Infer execute argument and result types from schemas.

## Parent and state

Parent: R-EXT. Class: Required. Initial state: **BLOCKED**. Current state: **ACCEPTED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BUILD-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/sdk/; tests/sdk/; consumer fixtures. Task-specific evidence under docs/delivery/evidence/SDK-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement defineCommand/action generics, separate config/args/input/output validation, execution modes and contexts. Infer execute argument and result types from schemas.

## Acceptance criteria

- Invalid output after postprocessing fails.
- Optional/default fields infer correctly.
- A consumer compiles without runtime-internal imports.

## Verification

Positive/negative type fixtures plus runtime parsing tests; compile external consumer. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
