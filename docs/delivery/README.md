# Ribbit delivery plan

Private planning draft, 2026-09-13. This package adapts the structure of the [Stet reference commit](https://github.com/funsaized/stet/commit/7279869d68c09829de08b36cd74633e9dd63c0db): a dependency index, separate contracts, bounded task assignments and acceptance evidence. All task content is specific to Ribbit.

## Authority and execution

The user's current instructions take precedence. The PRD defines product scope; ratified contracts define behavior; backlog defines dependencies; task files define bounded implementation work. Contracts begin PROPOSED, not approved. Resolve contradictions by recording a decision and updating affected files. Do not silently change product scope.

States: BLOCKED → READY → IN_PROGRESS → REVIEW → ACCEPTED. A task becomes READY only when direct dependencies are ACCEPTED and its relevant contracts are ratified. A worker returns REVIEW with evidence; a designated reviewer/integrator marks ACCEPTED. Required human evidence needs actual owner-arranged participation. Post-release tasks remain inactive until separately selected.

Only BASE-01 is initially READY. Execute BASE-01 then DECIDE-01. Contract tracks 01/02/03/05 can be prepared independently after the runtime decision; CONTRACT-04 follows the first three. This plan permits future scheduling but does not instruct the current assistant to spawn agents or implement code. Parallel writers, if authorized, must own disjoint files; package metadata, lockfiles, SDK contracts and registry generators have one writer at a time.

## Task rules

Read task, parent PRD sections, relevant contracts and existing callers before editing. Paths are proposed for a greenfield repository; BASE-01 maps existing paths. Do not recreate an existing architecture solely to match names here. Keep changes inside listed scope; a necessary adjacent change requires a task amendment, not an unrelated refactor. Never weaken fixtures or alter budgets to make failures disappear. Add focused regression checks for material behavior. Stop when a contract is contradictory, a dependency is unaccepted, a gate fails without a scoped remedy, or permissions/credentials are unavailable. Record the blocker and the smallest next action. Do not invent test success.

No publication, outreach, public registry submission or account creation is included. Local reversible implementation and validation belong to implementation tasks when the owner starts that work. Publication remains separate from release-ready acceptance. Do not copy upstream code without a provenance/license decision.

## Verification interface

BUILD-01 must create and document equivalents of: check (types/lint), test:unit, test:consumer, test:cli, test:conformance, test:docs, build, bench, eval:semantic, eval:agent, package:smoke. These are planned script names, not claims they exist today. Tasks use the narrowest relevant subset; acceptance records exact commands from the chosen runtime. Missing provider credentials/platform hardware means unverified, never passed. Live evals are opt-in and count all requests/repairs.

## Completion

Each task writes docs/delivery/evidence/ID.md. Index status is authoritative; individual file initial states are synchronized when work starts. RELEASE-01 additionally checks every required task, not just its listed direct gate predecessors. RELEASE-02 prepares a private decision packet; it does not publish.
