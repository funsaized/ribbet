# EXT-01 — Accepted

Integrator review, 2026-09-13. Prerequisites SDK-02 and CORE-02 accepted.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Uninstalled source does not execute implicitly | PASS | Explicit installer only; discovery import-marker regression |
| Ordinary invocation does not download code | PASS | Installed echo executes with fetch disabled |
| Changed source requires explicit rebuild | PASS | Lifecycle test and independent consumer task 9 |
| Failed add preserves prior usable installation | PASS | Failed type-check preserves registry/artifact, restore and run |
| Removal retains user source | PASS | Lifecycle test |

Verification: `bun test tests/extensions`, package smoke and independent consumer traces. Metadata inspection covers help, types, named commands, route, plan and all three shell completions with an import sentinel and forbidden fetch. Runtime artifacts are immutable hash-checked bundles. Trusted extension execution is not sandboxing.
