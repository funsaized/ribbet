# PROV-02 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b5ba67d plus routing/provider implementation changes.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Works with selected local model | PASS | provider-ollama-live.json: qwen3.5:9b, text OK and validated {ok:true} |
| Never auto-pulls | PASS | Only /api/tags and /api/chat; protocol test records request paths |
| Malformed streams fail | PASS | Bad JSON, truncated completion, tool/refusal and length-stop tests |
| Request limits enforced | PASS | Shared managed Budget tests and live request/repair counts |

Live command (authorized local networking):

```sh
RIBBIT_TEST_BASE_URL=http://127.0.0.1:11434 RIBBIT_TEST_MODEL=qwen3.5:9b bun run scripts/live-provider.ts ollama
```

Exit 0. Two inference requests, zero repairs, zero retries; 1,461 reported tokens;
19,381 ms total including model listing and any provider load time. Text was `OK`;
JSON exactly {"ok":true}. This is a protocol smoke, not semantic quality or default-model
selection. Provider runtime version, model digest, size and quantization are recorded
in provider-ollama-environment.json. The model existed before work; none downloaded.
Initial sandboxed `ollama list` failed socket permission (1); authorized retry exited 0.

Protocol fixtures: tests/providers/ollama/protocol.test.ts. Live harness:
scripts/live-provider.ts. The same harness accepts an explicitly supplied compatible
endpoint for PROV-03. No hosted endpoint was contacted.

Integrator decision: adapter smoke and implementation criteria accepted; model quality
selection and broader hardware evidence remain EVAL-02.
