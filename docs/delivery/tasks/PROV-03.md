# PROV-03 — Implement OpenAI-compatible adapter

## Outcome

Implement the contracted compatible HTTP subset, custom base URL, API-key environment lookup, streaming and structured outputs. Handle endpoint capability differences without assuming provider identity.

## Parent and state

Parent: G4. Class: Required. Initial state: **BLOCKED**. Current state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted PROV-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/providers/openai-compatible/; tests/providers/compatible/. Task-specific evidence under docs/delivery/evidence/PROV-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement the contracted compatible HTTP subset, custom base URL, API-key environment lookup, streaming and structured outputs. Handle endpoint capability differences without assuming provider identity.

## Acceptance criteria

- LM Studio and hosted test endpoint have recorded conformance.
- Unsupported schema errors are actionable.
- Authorization headers never logged.

## Verification

Mock HTTP conformance and opt-in live checks with explicit credentials; no-key local endpoint case. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
