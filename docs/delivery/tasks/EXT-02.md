# EXT-02 — Execute extension actions through shared engine

## Outcome

Dispatch installed actions, inject budgets/logger/signal/managed inference interface and validate outputs. Distinguish extension execution errors from provider errors.

## Parent and state

Parent: G2/R-EXT. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-01; Accepted SDK-01; Accepted CORE-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/extensions/runtime/; tests/extensions/runtime/. Task-specific evidence under docs/delivery/evidence/EXT-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Dispatch installed actions, inject budgets/logger/signal/managed inference interface and validate outputs. Distinguish extension execution errors from provider errors.

## Acceptance criteria

- Built-in and third-party actions take identical path.
- Arbitrary TS exceptions become structured sanitized errors.
- Stream modes honor cancellation.

## Verification

Consumer action, thrown error, malformed output, cancellation and iterable cleanup tests. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
