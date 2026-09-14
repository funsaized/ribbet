# Resume here — 2026-09-14 (evening checkpoint)

Owner stopped the live semantic evaluation for this session; all eval processes and the LM Studio server started for it are stopped. The macOS/perf/ship/docs gates are now closed. This tree is uncommitted; inspect `git status --short`.

## Backlog counts

50 required tasks: **44 ACCEPTED, 1 REVIEW, 1 owner-deferred, 4 BLOCKED**. FOLLOW tasks stay out of v1.

- REVIEW: PROV-04. Implementation and runtime checks pass; held only because its declared predecessor PROV-03 (hosted OpenAI conformance) is owner-deferred.
- DEFERRED: PROV-03.
- BLOCKED: EVAL-02, PILOT-01, RELEASE-01, RELEASE-02.

The backlog table is authoritative: [backlog.md](backlog.md).

## Closed this session

- Remaining 2026-09-13 audit findings, with regressions. Adversarial, filesystem, flow and CLI acceptance tests added.
- PERF-01, SHIP-01, DOCS-02 — both platform artifacts rebuilt from one tree and measured in place. See [PERF-01](evidence/PERF-01.md), [SHIP-01](evidence/SHIP-01.md), [DOCS-02](evidence/DOCS-02.md), [performance](../performance.md), [checkpoint](evidence/CHECKPOINT-20260914.md).

| Gate | Linux | macOS |
| --- | --- | --- |
| help/version p95 ≤100 ms | 38.7 / 38.4 | 30.6 / 29.8 |
| extension p95 ≤150 ms | 121.4 | 80.9 |
| managed pre-HTTP p95 ≤100 ms | 66.2 | 48.4 |
| 100k take incremental RSS ≤128 MiB | 42936 KiB | n/a (Linux reference) |

Artifacts: Linux `dist/ribbit` `b23e33cf…`, macOS `dist/ribbit-darwin-arm64` `a9227bf8…` (full hashes in the checkpoint).

## Semantics — EVAL-02 (blocking)

Full held-out runs (750 attempts, 3 reps): Qwen2.5 0.5B `.332/.524/.749`; 1.5B `.855/.651/.984` before the label-prompt change and `.333/.444/.987` with current code — the explicit-label variant regressed filter/classify.

Development-split screens only (1 rep, not comparable to the full runs): gemma-4-e4b `.944/.867/.400`; ribbit-qwen27b IQ4_XS `1/1/1`. Required: **all three ≥0.90**. No candidate has met it on the full held-out set.

Open owner decision: block release; accept a larger candidate with a documented hardware requirement (27B IQ4_XS needs >12 GiB); or evaluate another small model. Full run ≈3 h.

## Remaining

1. EVAL-02: decide the model path, then run the full 750-attempt eval and `scripts/evaluate-rubrics.ts` (written, never run).
2. PROV-04: one owner decision — supply the hosted OpenAI key for PROV-03, or record a waiver substituting the LM Studio OpenAI-compatible path.
3. PILOT-01: owner is participant 1; gate is ≥4/5 users and simulated runs do not count. Needs recruitment or a recorded gate revision.
4. RELEASE-01/02 after the above.

## Exact resume steps

```sh
lms server start
lms load ribbit/qwen38-27b-desktop-8k -y -c 8192 --gpu max --identifier ribbit-qwen27b

npm run check && TMPDIR=/home/saiguy/.cache/ribbit-tmp npm run test:unit

RIBBIT_RUN_LIVE_EVAL=1 RIBBIT_EVAL_PROFILE=local-27b-eval RIBBIT_EVAL_QUANT=IQ4_XS \
  RIBBIT_EVAL_TOTAL_MS=180000 RIBBIT_EVAL_REQUEST_MS=120000 bun run scripts/evaluate.ts

RIBBIT_RUN_LIVE_EVAL=1 RIBBIT_EVAL_PROFILE=local-27b-eval RIBBIT_EVAL_QUANT=IQ4_XS \
  bun run scripts/evaluate-rubrics.ts

lms unload --all && lms server stop
```

`scripts/evaluate.ts` supports `RIBBIT_EVAL_PER` (per-command screen) and `RIBBIT_EVAL_REPS`; it writes `evals/results/in-progress.json` after every attempt.

## Environment notes

- `/tmp` tmpfs returns `EDQUOT`; run tests/smoke with `TMPDIR=/home/saiguy/.cache/ribbit-tmp`.
- LM Studio server stopped and model unloaded; Ollama not running.
- macOS CLI resolves its SDK at `dist/lib/` beside the executable; place it there when shipping.
- `~/.config/ribbit/config.yaml` gained `local-gemma` and `local-27b-eval` profiles; default remains `local-test`.
