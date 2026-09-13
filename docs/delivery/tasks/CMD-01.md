# CMD-01 — Ship ask, summarize, explain and rewrite

## Outcome

Author four public types through SDK with common prompting and additive rules. Implement summarize word ceiling via validated result/one repair rather than silent destructive truncation.

## Parent and state

Parent: C01–C04. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/text/; fixtures/text/; tests/text/. Task-specific evidence under docs/delivery/evidence/CMD-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Author four public types through SDK with common prompting and additive rules. Implement summarize word ceiling via validated result/one repair rather than silent destructive truncation.

## Acceptance criteria

- All four expose schema/help/examples.
- Exact requested max words enforced or explicit failure.
- Inputs treated as data.
- No shell actions.

## Verification

Mock prompt/output tests and adversarial evidence inputs; semantic fixtures passed to EVAL-02. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
