# FLOW-01 — Implement YAML definitions and resolution

## Outcome

Parse strict versioned YAML, validate type/version/action/config/defaults, resolve installed names and generate named command help. Reject executable YAML tags and duplicate keys.

## Parent and state

Parent: G3/R-FLOW. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted SDK-02; Accepted ROUTE-01; Accepted CLI-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/definitions/; src/cli/run/; tests/definitions/. Task-specific evidence under docs/delivery/evidence/FLOW-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Parse strict versioned YAML, validate type/version/action/config/defaults, resolve installed names and generate named command help. Reject executable YAML tags and duplicate keys.

## Acceptance criteria

- Definition cannot shadow built-in silently.
- Exact type version validated.
- Invocation override does not mutate YAML.
- Schema errors include paths.

## Verification

Positive/negative definitions, duplicate keys/names, stale type version and CLI args override. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
