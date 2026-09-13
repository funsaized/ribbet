# DOCS-01 — Write complete command, SDK and routing docs

## Outcome

Write quickstart, all 22 command references, modes/errors/limits, routing precedence, executable trust model and extension authoring. Create the three signature demos and six PRD use cases.

## Parent and state

Parent: G1/G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FLOW-03; Accepted FS-05; Accepted AGENT-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/user/; docs/sdk/; examples/. Task-specific evidence under docs/delivery/evidence/DOCS-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Write quickstart, all 22 command references, modes/errors/limits, routing precedence, executable trust model and extension authoring. Create the three signature demos and six PRD use cases.

## Acceptance criteria

- All examples map to actual schemas.
- Routing examples resolve as stated.
- No unsupported provider claim.
- Built-ins and extension paths both taught.

## Verification

Run all examples with fixtures/mocks; flag optional live examples; generated reference freshness check. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
