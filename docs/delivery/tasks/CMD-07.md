# CMD-07 — Ship render and safe templates

## Outcome

Implement table/text/JSON/JSONL and literal field templates. Escape terminal controls in display modes while preserving machine data; template lookup never evals code.

## Parent and state

Parent: C22. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted CONTRACT-04

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/render/; tests/render/. Task-specific evidence under docs/delivery/evidence/CMD-07.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement table/text/JSON/JSONL and literal field templates. Escape terminal controls in display modes while preserving machine data; template lookup never evals code.

## Acceptance criteria

- Missing placeholders fail clearly.
- Output values are not accidentally rewrapped.
- Arbitrary template text cannot spawn code.

## Verification

Template injection, Unicode widths, empty table, nested objects and JSON round trips. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
