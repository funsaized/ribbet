# CORE-01 — Implement record adapters and wire format

## Outcome

Implement text/lines/jsonl/records input adapters, bounded auto detection, IDs, source/annotations and output serializers. Preserve line boundaries and validate finite JSON values.

## Parent and state

Parent: R-DATA. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BUILD-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/engine/records/; tests/records/. Task-specific evidence under docs/delivery/evidence/CORE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement text/lines/jsonl/records input adapters, bounded auto detection, IDs, source/annotations and output serializers. Preserve line boundaries and validate finite JSON values.

## Acceptance criteria

- Header/version errors have locations.
- Final unterminated line works.
- Explicit text bypasses detection.
- Round trip preserves record identity and content.

## Verification

Adapter fixtures including malformed UTF-8/JSON, header collision, empty input and multiline values. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
