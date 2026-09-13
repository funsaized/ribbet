# AGENT-02 — Ship agent guidance initialization

## Outcome

Write opt-in tool-specific entrypoints and one canonical authoring guide with discover-configure-extend-test-compose loop. Merge using marked owned sections and avoid rewriting unrelated guidance.

## Parent and state

Parent: G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted AGENT-01; Accepted CLI-02; Accepted FLOW-02

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

templates/agent-guidance/; src/cli/init/; tests/init/. Task-specific evidence under docs/delivery/evidence/AGENT-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Write opt-in tool-specific entrypoints and one canonical authoring guide with discover-configure-extend-test-compose loop. Merge using marked owned sections and avoid rewriting unrelated guidance.

## Acceptance criteria

- Repeated init idempotent.
- Works for codex/claude/cursor/opencode.
- Agent examples reference only real public commands.

## Verification

Golden initialized repos including existing instruction files; repeat init and changed-template upgrade. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
