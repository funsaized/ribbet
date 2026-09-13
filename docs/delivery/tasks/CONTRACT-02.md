# CONTRACT-02 — Freeze SDK, build and extension trust contracts

## Outcome

Define SDK signatures, streaming mode, schema subset, generated manifest format, dependency locks and trust activation. Choose supported TS/Zod versions based on the spike and freeze a test consumer.

## Parent and state

Parent: G2/G6; R-EXT. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/extensions.md; fixtures/contracts/. Task-specific evidence under docs/delivery/evidence/CONTRACT-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Define SDK signatures, streaming mode, schema subset, generated manifest format, dependency locks and trust activation. Choose supported TS/Zod versions based on the spike and freeze a test consumer.

## Acceptance criteria

- No separate hidden built-in API.
- Help reads a manifest.
- Imports only execute during explicit build/install or run.
- Unsupported Zod features fail precisely.

## Verification

Compile representative extension consumer; validate manifest fixtures; adversarial import fixture. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
