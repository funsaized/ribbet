# End-of-day checkpoint

Owner requested status, documentation updates, a clean stopping point and shutdown of processes started by the assistant.

## Completed versus remaining

See [handoff](../HANDOFF.md) and [backlog](../backlog.md): 17 accepted, 28 review, one owner-deferred, four blocked, out of 50 required tasks. REVIEW is not release completion. EXT-01 and EXT-02 now have per-criterion acceptance evidence. Agent and dataset evaluations have real recorded results, but their broader release prerequisites remain open.

Validation: `npm run check`, `npm run test:unit` (95), `npm run test:cli` (9), `npm run test:consumer` (1), `npm run build`, `npm run package:smoke`, `npm run test:docs` passed. Independent consumer results are in evals/agent/results; source audits are preserved separately. Final release-revision platform/performance verification remains outstanding.

## Semantic results retained

| Model / variant | Filter macro F1 | Classify macro F1 | Extraction field correctness |
| --- | --- | --- | --- |
| Qwen2.5 0.5B baseline | .332 | .524 | .749 |
| Qwen2.5 1.5B initial | .855 | .651 | .984 |
| Qwen2.5 1.5B explicit-label/filter variant | .333 | .444 | .987 |

Each row has 750 attempts (250 examples, three repetitions) through LM Studio. All miss the required combined .90 gate. Prompt variant regression is an open issue. The current small test default is not release-approved. Qwen3.8 has not been evaluated.

## Owner decisions

Hosted OpenAI API-key testing is deferred until the owner supplies it later. Continue using the local compatible endpoint. Independent agent evaluations are authorized and were executed. Owner is the first nominated pilot participant and will recruit additional users; no completed pilot session is assumed.

## LM Studio (delivery test path)

Loopback OpenAI-compatible endpoint at `127.0.0.1:1234`. Delivery evals used Qwen2.5 0.5B / 1.5B, not the 27B desktop recipe. That experiment lives in `~/Projects/qwen38-3080ti`.

Final loopback conformance test passed (one test); documentation links/examples and whitespace checks passed.

Shutdown verified: LM Studio daemon reports `not-running`; no llmster/model server/project worker remained in the process check. GPU memory returned to 1557 MiB used / 10320 MiB free. The pre-existing Ollama service was preserved. Both evaluation agents completed.
