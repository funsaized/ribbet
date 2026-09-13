# PROV-01 — Implement managed inference interface

## Outcome

Implement normalized text/object calls, response usage, capability declarations, repair and retry boundaries. Propagate route and budget to every call.

## Parent and state

Parent: G4/R-EXT. Class: Required. Initial state: **BLOCKED**. Current state: **ACCEPTED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted ROUTE-01; Accepted SDK-01; Accepted CORE-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/providers/interface/; src/engine/inference/; tests/providers/. Task-specific evidence under docs/delivery/evidence/PROV-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement normalized text/object calls, response usage, capability declarations, repair and retry boundaries. Propagate route and budget to every call.

## Acceptance criteria

- Text streams and object responses share cancellation/stats.
- Missing usage stays unknown.
- No hidden fallback or tool calls.

## Verification

Mock adapter contract including refusal, timeout, truncated output and unsupported schema. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
