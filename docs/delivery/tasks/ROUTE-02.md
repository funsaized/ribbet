# ROUTE-02 — Implement provider/profile management and inspection

## Outcome

Add list/add/remove providers, profiles list/show/set/remove and route inspect. Store apiKeyEnv reference, never secret values; atomic config updates.

## Parent and state

Parent: G4/G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted ROUTE-01; Accepted CLI-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/cli/providers/; src/cli/profiles/; src/cli/route/; tests/config-cli/. Task-specific evidence under docs/delivery/evidence/ROUTE-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Add list/add/remove providers, profiles list/show/set/remove and route inspect. Store apiKeyEnv reference, never secret values; atomic config updates.

## Acceptance criteria

- No secret displayed or placed in manifest.
- Config corruption does not overwrite prior config.
- Inspect makes no network calls.

## Verification

Temp config homes; redaction fixtures; invalid config; interrupted write simulation. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
