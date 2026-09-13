# CONTRACT-01 — Freeze command and data contracts

## Outcome

Ratify wire header, command arguments, exit codes, records, field selectors, stdin/file ambiguity, empty inputs and serialization. Add normative successful and failing fixtures.

## Parent and state

Parent: G1/G5; R-DATA. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/cli-data.md; fixtures/contracts/. Task-specific evidence under docs/delivery/evidence/CONTRACT-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Ratify wire header, command arguments, exit codes, records, field selectors, stdin/file ambiguity, empty inputs and serialization. Add normative successful and failing fixtures.

## Acceptance criteria

- All 22 commands have unambiguous input/output modes.
- Wire auto-detection cannot silently reinterpret ordinary JSON.
- Partial output and early pipe closure are specified.

## Verification

Review fixture matrix against PRD C01–C22; parse all JSON fixtures. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
