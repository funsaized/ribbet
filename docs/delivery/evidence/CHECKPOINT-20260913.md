# End-of-day checkpoint

Owner requested status, documentation updates, a clean stopping point and shutdown of processes started by the assistant. A final additional request authorized preparation of Unsloth Qwen3.8-27B UD-IQ4_XS for LM Studio without consuming all VRAM.

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

## LM Studio setup

Actual GPU: RTX 3080 Ti, 12288 MiB. The downloaded requested 27B file is 14,252,845,984 bytes; publisher SHA-256 is `40fac4050e940397dbf13087afd50f4734a11805bf9d65ef8ddd7483470e6199`. Preset and guarded launcher are tracked under config/lmstudio and scripts/lmstudio-qwen27b.mjs. Starting configuration is 8K context, .4 weight offload, Q4_0 K/V cache, Flash Attention, one slot, and 2 GiB free VRAM headroom checks. Initial loading and short generation passed; cache quality and sustained generation throughput remain unverified; no full-VRAM settings are copied.

Download verification passed: exact byte count, GGUF header and SHA-256 matched the publisher. LM Studio estimated 5825 MiB VRAM. Actual free VRAM was 3552 MiB after load and a minimum 3516 MiB during a short OpenAI-compatible request. Returned `Model ready` in 5.72 seconds, with 30 completion tokens including reasoning. Reported load configuration confirmed Q4_0 K/V, Flash Attention, 8192 context and .4 offload. Keep this conservative ratio; the estimate understated actual allocation.

Final loopback conformance test passed (one test); documentation links/examples and whitespace checks passed.

Shutdown verified: LM Studio daemon reports `not-running`; no llmster/model server/project worker remained in the process check. GPU memory returned to 1557 MiB used / 10320 MiB free. The pre-existing Ollama service was preserved. Both evaluation agents completed.
