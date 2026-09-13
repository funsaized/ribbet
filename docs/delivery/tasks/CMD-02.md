# CMD-02 — Ship extract and classify

## Outcome

Support schema file extraction, missing-value policy, finite label classification, original records and annotation namespaces. Validate candidate labels by identity, not loose text parsing.

## Parent and state

Parent: C05–C06. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/structured/; fixtures/structured/; tests/structured/. Task-specific evidence under docs/delivery/evidence/CMD-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Support schema file extraction, missing-value policy, finite label classification, original records and annotation namespaces. Validate candidate labels by identity, not loose text parsing.

## Acceptance criteria

- Invalid/unsupported schema fails before inference.
- No invented class.
- Repaired responses counted.
- Output never emits invalid schema.

## Verification

Missing facts, unknown label, malicious input, invalid JSON/refusal and postprocess validation tests. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
