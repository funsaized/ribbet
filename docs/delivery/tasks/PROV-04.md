# PROV-04 — Implement setup, doctor and model discovery

## Outcome

Implement local-first setup, models list, provider diagnostics, model availability and optional download instructions. Respect non-TTY usage and existing config.

## Parent and state

Parent: G4/G8. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted PROV-02; Accepted PROV-03; Accepted ROUTE-02; Accepted CLI-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/cli/setup/; src/cli/doctor/; tests/setup/. Task-specific evidence under docs/delivery/evidence/PROV-04.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement local-first setup, models list, provider diagnostics, model availability and optional download instructions. Respect non-TTY usage and existing config.

## Acceptance criteria

- No remote fallback or automatic model download.
- Setup shows evidence for local suggestion.
- Doctor separates config errors from absent runtime/model.

## Verification

Fresh config, unreachable endpoints, no model, unsupported model, CI and repeated setup tests. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
