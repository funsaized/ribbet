# FOLLOW-03 — Explore sandboxed extension distribution

## Outcome

Evaluate enforcement and distribution before introducing marketplace installs or trust claims.

## Parent and state

Parent: Deferred. Class: Post-release. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted RELEASE-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

future extension RFC. Task-specific evidence under docs/delivery/evidence/FOLLOW-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Evaluate enforcement and distribution before introducing marketplace installs or trust claims.

## Acceptance criteria

- Threat model and real permission enforcement validated independently of manifest declarations.

## Verification

Adversarial runtime proof when activated. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
