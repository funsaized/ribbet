# EVAL-01 — Create labeled semantic datasets and rubrics

## Outcome

Create provenance-documented synthetic/public permitted fixtures meeting PRD counts, held-out splits and reviewer labels. Include unknown/missing facts and adversarial records.

## Parent and state

Parent: G7. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-05

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

evals/datasets/; evals/rubrics/; docs/delivery/evidence/. Task-specific evidence under docs/delivery/evidence/EVAL-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Create provenance-documented synthetic/public permitted fixtures meeting PRD counts, held-out splits and reviewer labels. Include unknown/missing facts and adversarial records.

## Acceptance criteria

- Counts and label agreement reported.
- No confidential production data.
- Held-out set distinct from prompt tuning set.
- Rubrics score factuality independently of schema.

## Verification

Dataset schema checks, duplicate/leakage checks and reviewer sample audit. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
