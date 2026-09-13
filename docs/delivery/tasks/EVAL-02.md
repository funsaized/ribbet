# EVAL-02 — Select default small local model and evaluate commands

## Outcome

Evaluate candidate small models and a larger local reference on frozen fixtures; record first-pass and repair quality, cold/warm latency and quantization. Select default only if gates pass.

## Parent and state

Parent: G7. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EVAL-01; Accepted PROV-02; Accepted PROV-03; Accepted CMD-01; Accepted CMD-02; Accepted CMD-03; Accepted CMD-04; Accepted CMD-05; Accepted FS-03; Accepted FS-04

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

evals/results/; docs/models.md; default model config. Task-specific evidence under docs/delivery/evidence/EVAL-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Evaluate candidate small models and a larger local reference on frozen fixtures; record first-pass and repair quality, cold/warm latency and quantization. Select default only if gates pass.

## Acceptance criteria

- All required semantic thresholds met or release blocked.
- Unsupported hardware requirements visible.
- No claim that a model is fast without environment.

## Verification

Three runs per candidate/test family; archived aggregate/raw metrics and reviewer rubric scores. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
