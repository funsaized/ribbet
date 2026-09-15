# PROV-04 — ACCEPTED 2026-09-15

Implementation and runtime behavior verified against the packaged Linux binary.

Prerequisite PROV-03 is now ACCEPTED: both LM Studio and a hosted OpenAI-compatible
endpoint have recorded live conformance (`provider-lmstudio-live.json`,
`provider-hosted-live.json`). The earlier hold was solely that prerequisite, not a defect.

Runtime evidence (`./dist/ribbit`, `TMPDIR` on disk):

- `setup --json` probes Ollama `:11434` and LM Studio `:1234/v1`, reports `reachable:false` for both when off, and `downloadPerformed:false`.
- `doctor --json` returns configuration/picker checks; `doctor --probe --json` adds per-provider reachability and sets `ok:false` when providers are down — configuration errors are distinct from absent runtime.
- `providers list`, `profiles list` and `route inspect ask --json` resolve without exposing secrets.

| Criterion | Result | Evidence |
| --- | --- | --- |
| No automatic fallback or model download | PASS | `setup --json` `downloadPerformed:false` |
| Setup shows evidence for its local suggestion | PASS | probes both loopback endpoints |
| Doctor separates config errors from absent runtime/model | PASS | checks[] with configuration/picker vs provider names |

Resolved: PROV-03 hosted conformance was completed on 2026-09-15, so the prerequisite is accepted and the alternative waiver is no longer needed. Reviewer decision: ACCEPTED.
