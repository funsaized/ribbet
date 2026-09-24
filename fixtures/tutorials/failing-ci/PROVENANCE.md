# Provenance: failing-CI diagnosis

The [healthy parent](https://github.com/funsaized/ribbit/commit/4824aac91a3b2a3bd42ffd7e84850ff709960eaf) passes `bun test tests/release/projection-baseline.test.ts`. The deliberately broken [demo commit](https://github.com/funsaized/ribbit/commit/736583fd7a27dd9090ea3ebef358d864dcc3b256) changes only the projection yield in application code: `yield { ...r, value }` becomes `yield { id: r.id, value }`. The dedicated [failed workflow run](https://github.com/funsaized/ribbit/actions/runs/36018875927) (2026-09-24) confirms the test fails because `annotations` is missing from the projected record. The bounded evidence files were published in [commit fa32d61](https://github.com/funsaized/ribbit/commit/fa32d61a23849b9419c2e29292dc1ad72ac4ea10). The branch is deliberately left broken; it is not main.

| File | Evidence |
| --- | --- |
| `ci.log` | Bounded excerpt of the failed workflow's test output; runner timestamps, prefixes and stack lines omitted. The command header is supplied for orientation. This is captured CI output, not a model answer or a complete log. |
| `changes.diff` | Minimal applicable unified diff of the parent-to-demo source change; `git diff 4824aac 736583f -- src/builtins/exact.ts` shows the full patch. |
| `src/builtins/exact.ts` | Exact lines 105–115 of the broken commit, with original line numbers in the excerpt. Excerpt line 9 is [source line 113](https://github.com/funsaized/ribbit/blob/736583fd7a27dd9090ea3ebef358d864dcc3b256/src/builtins/exact.ts#L113). Not a standalone TypeScript file. |
| `tests/release/projection-baseline.test.fixture` | Copy of the real regression test in the healthy parent and broken child, renamed to `.fixture` so Bun does not discover it under `fixtures/`. On the branch, run `bun test tests/release/projection-baseline.test.ts`. |
| `failure-signature.txt` | Stable `(fail)` test name for offline assertions; elapsed times and model prose are not bytewise expectations. |
| `diagnose.schema.json` | Author-written structural contract for routed interpretation; does not prove a diagnosis true. |

The source diff and the captured test's missing `annotations` path must both agree; a generic nonzero exit is not sufficient. The workflow has read-only repository permission and no secrets or publishing steps. Normal verify CI excludes only this demo branch, while main remains healthy. Use an installed healthy `ribbit` to investigate saved evidence; do not use the broken checkout's executable for investigation. No automatic patching occurs. The demo branch's history is immutable at the linked SHAs even if its tip later advances.
