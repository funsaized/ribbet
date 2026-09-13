# SDK-02 — Accepted generated schema baseline

Integrator review, 2026-09-13.

| Criterion | Result | Evidence |
| --- | --- | --- |
| One source for help, schema, completion | PASS | Built-in declarations generate the catalog; consumers read manifests |
| Nested args through JSON | PASS | Parser and manifest tests |
| Stale cache detectable | PASS | Source hashes plus explicit rebuild requirement in extension lifecycle test |
| No duplicate authored schema | PASS | Zod export drives generated catalog |

`bun test tests/manifests tests/cli/parser.test.ts tests/extensions` passed. Regeneration produces the same catalog bytes for unchanged sources. Unsupported transforms/refinements, runtime flag collisions and nonfinite JSON are rejected. All 22 manifests generate successfully. SDK packaging has also been exercised natively on Linux and macOS; that does not replace later release audit.
