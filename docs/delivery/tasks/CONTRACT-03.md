# CONTRACT-03 — Freeze routing and provider conformance

## Outcome

Translate the PRD precedence into a table-driven resolver specification including provider-only reset, model-only override, profile replacement, flow defaults and force-profile. Define supported HTTP payload subset and secret redaction.

## Parent and state

Parent: G4; R-ROUTE. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/routing.md; fixtures/routes/. Task-specific evidence under docs/delivery/evidence/CONTRACT-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Translate the PRD precedence into a table-driven resolver specification including provider-only reset, model-only override, profile replacement, flow defaults and force-profile. Define supported HTTP payload subset and secret redaction.

## Acceptance criteria

- Every precedence pair has expected resolved fields and provenance.
- Provider change cannot retain foreign model accidentally.
- No endpoint contacted by route inspection.

## Verification

Review route table; serialize fixture inputs and expected outputs. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
