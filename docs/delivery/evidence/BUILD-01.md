# BUILD-01 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b08ef6f plus contract and foundation changes in this commit.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Fresh locked install and baseline checks | PASS | build-linux-fresh.txt, isolated checkout copy, offline npm ci |
| No public upload action | PASS | private=true; scripts/ci.sh only runs local commands |
| Generated sources reproducible | PASS | No generated source yet; lockfile digest unchanged after clean installation |

Pinned dependencies are in package-lock.json. Script mapping and package boundaries
are in docs/development.md. The CI skeleton is scripts/ci.sh; it does not provision
public CI or publish artifacts. Strict check, unit, CLI, native build, installed smoke,
and documentation link validation all exited 0, including in a fresh temporary copy.
Bun 1.4.0 cross-compilation for macOS arm64 initially failed sandbox DNS, then succeeded
with authorized networking; the matching-runtime binary ran --help/--version on mini
(exit 0, build-macos-smoke.txt). This closes the prototype's embedded runtime version
mismatch for the foundation binary. Broader platform validation remains SHIP-01.

Consumer/conformance suites do not yet have implementation tests. Evaluation and
benchmark entry points explicitly fail as unimplemented. Their existence is not
passing evidence. The binary offers development help/version only; no command
implementation or release readiness is claimed. Empty package boundaries are reserved
for their owning tasks. No credentials, telemetry, or publication.

Integrator decision: build foundation accepted; CORE-01 and SDK-01 may start.
