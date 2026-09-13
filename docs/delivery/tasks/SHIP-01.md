# SHIP-01 — Package installable artifacts for target platforms

## Outcome

Produce private release candidate binaries/packages with version metadata, locked dependencies and checksums. Include bundled SDK templates/manifests, document fzf and provider prerequisites.

## Parent and state

Parent: G8. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted QA-01; Accepted PERF-01

## Required reading

[PRD](../../../Ribbit-PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

build/release/; packaging scripts; CI packaging jobs. Task-specific evidence under docs/delivery/evidence/SHIP-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Produce private release candidate binaries/packages with version metadata, locked dependencies and checksums. Include bundled SDK templates/manifests, document fzf and provider prerequisites.

## Acceptance criteria

- Fresh machines can run help and deterministic tools without compiler.
- Installed extension works offline after build.
- No public publishing triggered.

## Verification

Clean install/uninstall smoke on macOS arm64/Linux x86_64; verify checksums and version. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.
