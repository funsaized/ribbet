# BUILD-01 — Create workspace, scripts and CI skeleton

## Outcome

Initialize chosen runtime workspace, lint/typecheck/unit/consumer test scripts and build entrypoint. Establish package boundaries for sdk, engine, cli, providers and built-ins. Pin dependencies and create script name map.

## Parent and state

Parent: G2/G7. Class: Required. Initial state: **BLOCKED**. Current state: **ACCEPTED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-01; Accepted CONTRACT-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

package/workspace configs; src/ entrypoints; tests/; CI; lockfile. Task-specific evidence under docs/delivery/evidence/BUILD-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Initialize chosen runtime workspace, lint/typecheck/unit/consumer test scripts and build entrypoint. Establish package boundaries for sdk, engine, cli, providers and built-ins. Pin dependencies and create script name map.

## Acceptance criteria

- Fresh checkout can install locked dependencies and run baseline checks.
- No public upload action enabled.
- Generated sources are reproducible.

## Verification

Fresh install/build/check on target runner; lockfile repeatability. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
