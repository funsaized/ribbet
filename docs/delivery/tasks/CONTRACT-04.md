# CONTRACT-04 — Freeze linear flow and filesystem contracts

## Outcome

Specify reference path grammar, inline segment parsing, barriers, route inheritance, ignores, symlinks, evidence reads, picker transport and unknown schemas. Define template syntax without eval.

## Parent and state

Parent: G3/G5; R-FLOW/R-FS. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-01; Accepted CONTRACT-02; Accepted CONTRACT-03

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/flows-filesystem.md; fixtures/flows/. Task-specific evidence under docs/delivery/evidence/CONTRACT-04.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Specify reference path grammar, inline segment parsing, barriers, route inheritance, ignores, symlinks, evidence reads, picker transport and unknown schemas. Define template syntax without eval.

## Acceptance criteria

- References address prior steps only.
- Invalid paths fail.
- Filenames are never generated.
- Model reads are explicit.
- Fzf mapping preserves hostile labels safely.

## Verification

Review positive/negative flow YAML and filesystem scenario matrix. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
