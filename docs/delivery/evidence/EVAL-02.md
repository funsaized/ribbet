# EVAL-02 — Select default small local model and evaluate commands

State: **BLOCKED** — the filter/classify/extract semantic gate now has a passing candidate (gemma-4-e4b, all three runs), but the rubric families have not been evaluated and prerequisite PROV-03 is unaccepted.

Environment: Linux, RTX 3080 Ti 12 GiB, 32 CPU cores, Bun 1.4.0; LM Studio and Ollama on loopback. Gate: filter macro-F1, classify macro-F1 and extraction field correctness each ≥ 0.90.

## Method

Three independent full runs per candidate. Each run is 250 frozen fixtures × 3 repetitions = 750 attempts, on a dataset variant of `evals/datasets/core.json` whose classify `--labels` argument carries `name=description` for all four labels. 9,000 attempts total; zero harness errors in any model-run across all three runs.

Raw evidence per run — model JSON, per-model log, resource trace and summary: `evals/results/full-20260914-described/{run1,run2,run3}/`. The described-label dataset variant is regenerated from `core.json` per run and is not committed. The earlier plain-label full run is preserved in `evals/results/full-20260914/`.

## Consolidated results — 3 runs × 750 attempts

| Model | Metric | Run 1 | Run 2 | Run 3 | Mean | Min | Max | SD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **gemma-4-e4b** 7.5B Q4_K_M | filter | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 0.000 |
| | classify | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 0.000 |
| | extract | 0.922 | 0.931 | 0.904 | 0.919 | 0.904 | 0.931 | 0.011 |
| Qwen2.5 1.5B Q4_K_M | filter | 0.906 | 0.862 | 0.859 | 0.876 | 0.859 | 0.906 | 0.022 |
| | classify | 0.892 | 0.873 | 0.884 | 0.883 | 0.873 | 0.892 | 0.008 |
| | extract | 0.987 | 0.978 | 0.978 | 0.981 | 0.978 | 0.987 | 0.004 |
| Qwen3.5 9B (Ollama) | filter | 0.825 | 0.861 | 0.810 | 0.832 | 0.810 | 0.861 | 0.021 |
| | classify | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 0.000 |
| | extract | 0.998 | 0.998 | 0.998 | 0.998 | 0.998 | 0.998 | 0.000 |
| Qwen2.5 0.5B Q4_K_M | filter | 0.379 | 0.318 | 0.322 | 0.340 | 0.318 | 0.379 | 0.028 |
| | classify | 0.833 | 0.872 | 0.851 | 0.852 | 0.833 | 0.872 | 0.016 |
| | extract | 0.747 | 0.736 | 0.758 | 0.747 | 0.736 | 0.758 | 0.009 |

### Gate outcome per run

| Run | Models passing all three gates (≥ 0.90) |
| --- | --- |
| 1 | gemma-4-e4b |
| 2 | gemma-4-e4b |
| 3 | gemma-4-e4b |

**gemma-4-e4b is the only candidate that passes the semantic gate in every run.** Its filter and classify are exactly 1.000 in all three runs; extract varies in 0.904–0.931 but stays above the gate.

## Effect of the label descriptions

Descriptions were introduced to give the classifier the label semantics via the `--labels` argument (user input, not ground truth). Comparing the plain-label run (`full-20260914/`) with run 1 here:

| Model | Filter | Classify | Extract |
| --- | --- | --- | --- |
| gemma-4-e4b | .998 → 1.000 | .998 → 1.000 | .911 → .922 |
| Qwen2.5 1.5B | .889 → .906 | .756 → .892 | .984 → .987 |
| Qwen3.5 9B | .833 → .825 | 1.000 → 1.000 | 1.000 → .998 |
| Qwen2.5 0.5B | .353 → .379 | .732 → .833 | .736 → .747 |

The gain is concentrated in classify (+0.10 to +0.14 on the smaller Qwen models); gemma was already near ceiling and the 9B was already perfect.

## Resource monitoring

| Run | Active window | GPU util mean/max | GPU temp mean/max | Power mean/max | VRAM mean/max | CPU mean/max |
| --- | --- | --- | --- | --- | --- | --- |
| 1 (session-wide trace) | ~66 min* | 53 / 100 % | 66 / 83 °C | 190 / 349 W | 3.8 / 7.5 GB | 8.8 / 41 % |
| 2 | 36.5 min | 79 / 100 % | 78 / 83 °C | 309 / 349 W | 5.8 / 7.6 GB | 13.6 / 41 % |
| 3 | 58.8 min | 89 / 100 % | 78 / 83 °C | 274 / 348 W | 5.7 / 8.2 GB | 23 / 47 % |

\* run 1's trace also covers idle windows, so its active-window averages are approximate; runs 2–3 have clean per-run traces. All runs are GPU-bound: CPU never exceeded 47 %. Peak VRAM was 8.2 GB (9B); gemma peaks near 5.8 GB, comfortably within the 12 GiB card. Thermals held at 83 °C peak with no throttling observed.

## Findings

- gemma-4-e4b passes consistently and is the recommended default candidate.
- Run-to-run variance is material near the gate. Qwen2.5 1.5B's filter ranged .859–.906 (SD .022) — its single .906 reading in run 1 is an outlier on the high side, and runs 2–3 fall below the gate. No single-run reading close to .90 should be trusted.
- Qwen3.5 9B's weakness is filter (.810–.861, never passing) despite perfect classify and near-perfect extract. Descriptions did not help its filter.
- Qwen2.5 0.5B fails all gates.
- Descriptions improved classify clearly, and did not harm filter or extract.

## Caveats

- Fixtures are synthetic and template families overlap across splits; these numbers are not broad out-of-distribution generalization evidence.
- The described-label dataset variant is not committed and is regenerated per run; only `core.json` is frozen in-repo.
- Sampling variance at the observed SDs means sub-0.02 differences should not drive a decision; a `temperature: 0` run was not performed.
- Rubric families (`rank`, `group`, `reduce`, `compare`, `explain`) have not been evaluated; per `contracts/release.md` they require ≥ 85 % rubric pass on ≥ 30 cases per family with human factuality scoring (`evals/README.md`). `scripts/evaluate-rubrics.ts` uses regex heuristics and is not valid evidence for this.
- Prerequisite PROV-03 is unaccepted; the task stop condition applies until resolved or amended.

## Prior evidence (superseded)

Earlier full runs on plain `core.json` are recorded in `evals/results/full-20260914/`; earlier screens, the pre-prompt-change 1.5B runs and the prompt/definition experiments are in `evals/results/*.json`. Screens were development-split, 1 rep and are not comparable to the runs above. The Qwen3.8 27B IQ4_XS signal is a 3-example development screen and requires > 12 GiB.

## Acceptance criteria

| Criterion | Result |
| --- | --- |
| All required semantic thresholds met or release blocked | Semantic gate PASSED by gemma-4-e4b all runs; rubric families NOT run — task remains blocked |
| Unsupported hardware requirements visible | PASS — gemma peaks ~5.8 GB, fits 12 GiB |
| No claim that a model is fast without environment | PASS — environment and per-run resource measurements recorded above |

Reviewer decision: BLOCKED (rubric families outstanding; PROV-03 unaccepted).
