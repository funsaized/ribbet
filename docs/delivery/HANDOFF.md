# Resume here — 2026-09-13 checkpoint

The owner requested a logical stop for tomorrow. The commit containing this file is the checkpoint; use `git log -1` and `git status --short`. No claim of full release completion is made.

## Backlog counts

50 required tasks: **17 ACCEPTED, 28 REVIEW, 1 owner-deferred, 4 BLOCKED**. Five FOLLOW tasks are excluded from v1. The [backlog table](backlog.md) is authoritative.

- Accepted: baseline/runtime decision, all five contracts, build foundation, records/budgets, SDK/schema generation, routing core, managed inference/Ollama, and extension install/runtime.
- Implemented, still under review: all 22 commands, CLI/catalog/management, filesystem, definitions/flows, scaffold/guidance, adversarial QA, docs, packaging, performance and evaluations.
- Independent consumer evaluation: 10/10 completed, traces retained. Blind label review: 50/50 agreement from two independent AI reviewers. These are not human pilot sessions.
- Hosted OpenAI conformance: explicitly deferred by owner; use LM Studio's OpenAI-compatible endpoint now. Do not ask for an API key again until the owner resumes that test.
- Still blocked: semantic release quality/default model selection, actual pilots, complete release audit and launch decision packet.

## Latest verified work

95 unit/integration tests, nine CLI tests and one public SDK consumer test pass. Type-check, Linux build, packaged extension smoke and deterministic documentation examples pass. The loopback conformance check has its own evidence. Native Mac package and timing checks passed for the measured intermediate package; repeat against the final release revision.

Fixed today: shared flow reference consumption, preserved record output kind, cancellation of pending extension iterators, nested scaffold parents and fixture locations, missing classification labels, generated validation startup overhead, zero-take flow input reuse, partial reference preflight, early flow flag validation, plan limits/validate operation, management JSON diagnostic flags, UTF-8 BOM preservation, hyphen field paths, bounded projection indices, display controls and unreadable discovery-directory handling.

Linux measured extension p95 123.5 ms and managed pre-HTTP p95 70.3 ms. Mac: 82.0 ms and 48.8 ms respectively. These are intermediate-package timings, not final-release acceptance.

## Highest-priority work tomorrow

1. Reproduce and close the remaining findings in [flow/CLI audit](audits/flow-cli-20260913.md) and [filesystem audit](audits/filesystem-20260913.md). Several are fixed with regressions, but obvious array-item schema mismatches, complete named/runtime completion coverage, whole-output/template budgets, all-or-nothing picker validation, unreadable-directory regression coverage and final flow route/cancellation matrices still need review. Do not blanket-accept REVIEW tasks.
2. Investigate semantic prompt/model behavior before choosing a default. Both small models failed filter/classify thresholds. The explicit-label/filter prompt variant **regressed** aggregate filter/classify scores on 1.5B, although extraction reached 98.7%. Preserve both before/after reports; do not present the code correction as a measured quality improvement. Sample templates overlap across splits; avoid generalization claims.
3. Extend validation of the newly requested Qwen3.8-27B model and guarded LM Studio load settings; initial load and OpenAI-compatible smoke generation passed with at least 3516 MiB free VRAM. See [desktop setup](../lmstudio-qwen27b.md). It is too large for full residency on the actual 12 GiB RTX 3080 Ti. A 2 GiB free VRAM reserve is the policy; start with 8K context, partial offload, one slot and Q4 KV. No throughput or Q4 KV quality claim has been established.
4. Finish rubric-family evaluation and per-task acceptance, then rebuild/checksum/smoke both target packages and run final performance/doc gates.
5. Owner is participant 1 and will crowdsource four additional pilot participants. Use [pilot materials](../pilot/README.md); record actual sessions rather than assuming development usage counts.

## Local model profiles and restart

All inference for the current test path uses `http://127.0.0.1:1234/v1` (LM Studio OpenAI compatibility):

- `local-test`: Qwen2.5-0.5B Q4_K_M; fast plumbing tests, failed quality gate.
- `local-candidate`: Qwen2.5-1.5B Q4_K_M; comparison model, failed overall quality gate.
- `local-27b`: explicit `ribbit-qwen27b` loaded-instance alias, temperature .6; guarded launcher required.
- `local-qwen`: existing Ollama Qwen3.5:9b retained for reuse, but owner directed current evaluations through LM Studio.

The final [checkpoint evidence](evidence/CHECKPOINT-20260913.md) records process shutdown and model setup. Start LM Studio desktop/server deliberately tomorrow; nothing should be left evaluating overnight. The original user-owned Ollama service is not ours to terminate.
