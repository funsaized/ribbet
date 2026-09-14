# PROV-04 — REVIEW 2026-09-14

Implementation and runtime behavior verified against the packaged Linux binary. Held at REVIEW only because its declared prerequisite PROV-03 is owner-deferred (hosted OpenAI conformance), not because of a defect.

Runtime evidence (`./dist/ribbit`, `TMPDIR` on disk):

- `setup --json` probes Ollama `:11434` and LM Studio `:1234/v1`, reports `reachable:false` for both when off, and `downloadPerformed:false`.
- `doctor --json` returns configuration/picker checks; `doctor --probe --json` adds per-provider reachability and sets `ok:false` when providers are down — configuration errors are distinct from absent runtime.
- `providers list`, `profiles list` and `route inspect ask --json` resolve without exposing secrets.

| Criterion | Result | Evidence |
| --- | --- | --- |
| No automatic fallback or model download | PASS | `setup --json` `downloadPerformed:false` |
| Setup shows evidence for its local suggestion | PASS | probes both loopback endpoints |
| Doctor separates config errors from absent runtime/model | PASS | checks[] with configuration/picker vs provider names |

Blocker: PROV-03 hosted OpenAI-key conformance is deferred by the owner. To accept PROV-04 either supply the key for that test or record an owner waiver substituting the LM Studio OpenAI-compatible path. Reviewer decision: REVIEW pending that single owner decision.
