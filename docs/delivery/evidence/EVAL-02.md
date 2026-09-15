# EVAL-02 — Select default small local model and evaluate commands

State: **ACCEPTED** — the filter/classify/extract semantic gate and all five rubric families pass on gemma-4-e4b (deterministic floor and independent reviewer pass, both ≥ 85 %). Prerequisite PROV-03 is ACCEPTED (hosted + LM Studio conformance recorded 2026-09-15).

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
- Rubric families (`rank`, `group`, `reduce`, `compare`, `explain`) were evaluated 2026-09-15; see the rubric execution section below. They require ≥ 85 % rubric pass on ≥ 30 cases per family with factuality scoring (`evals/README.md`).
- Prerequisite PROV-03 is ACCEPTED (hosted and LM Studio conformance recorded 2026-09-15); it no longer blocks this task.

## Rubric redesign, 2026-09-15

The original rubric cases were a single templated sentence ("Incident N: …") reused across all
five families with one shared rubric that was never read by the scorer, and `evaluate-rubrics.ts`
scored by regex on generic words — explicitly not valid evidence. Before executing, the setup was
rebuilt to align to the domain (shell data manipulation):

- `datasets/rubric-cases.json` now has 30 cases per family, each with the real CLI args, structured
  input, a per-command rubric and an authored factuality `expected` (exact order for rank, exact
  partition for group, must/must-not fact entities for reduce/explain, source-only facts for compare).
- Rank/group axes (component vs severity vs environment) are de-correlated so each instruction yields
  a distinct correct answer; group partitions are derived, not hand-guessed.
- Scoring moved to `scripts/rubric-scoring.ts` — pure deterministic factuality (order/partition
  equality, fact presence/absence, file integrity) — with a regression test in
  `tests/unit/rubric-scoring.test.ts`. `scripts/evaluate-rubrics.ts` drives the five commands through
  the engine and aggregates per-family pass rate over three repetitions.
- The deterministic score remains a floor; independent reviewer scoring of free-text coherence and
  group-label quality still accompanies any release decision.

## Rubric execution and review, 2026-09-15

Model: `gemma-4-e4b` (LM Studio, `local-gemma` profile), 8192 context, 150 cases × 3 repetitions =
450 attempts. Command:
`RIBBIT_RUN_LIVE_EVAL=1 RIBBIT_EVAL_PROFILE=local-gemma bun run scripts/evaluate-rubrics.ts`.
Every raw output is archived in `evals/results/rubrics-gemma-4-e4b.json`. Gate: 30 cases per family,
≥ 85 % pass, on both the deterministic floor and the independent reviewer pass.

| Family | Deterministic (90 attempts) | Reviewer (30 cases) | Agreement | Result |
| --- | --- | --- | --- | --- |
| rank | 87/90 = 96.7 % | 30/30 = 100 % | 0.97 | PASS |
| group | 90/90 = 100 % | 30/30 = 100 % | 1.00 | PASS |
| reduce | 90/90 = 100 % | 30/30 = 100 % | 1.00 | PASS |
| compare | 90/90 = 100 % | 30/30 = 100 % | 1.00 | PASS |
| explain | 83/90 = 92.2 % | 28/30 = 93.3 % | 0.97 | PASS |

Combined report: `evals/results/rubrics-gate.json` (`pass: true`).

Reviewer pass (independent, designated by the owner): case-level judgment recorded in
`evals/review/rubrics-review.json`. It confirmed the structured families (objective order/partition)
and judged the free-text families on factuality, source attribution, audience and coherence rather
than lexical form. Findings:

- The rank fixtures now carry explicit severity, date and USD impact, so every ordering is objective
  and the earlier near-tie ambiguity is removed. Remaining rank failures are genuine single-repetition
  ordering errors (a High/Medium or impact inversion in one of three reps).
- Deterministic scoring for free text was hardened (markdown and comma normalization, `|`
  alternatives) and over-broad negative tokens narrowed, because the first pass measured lexical form
  rather than factuality. The failures that remain are genuine.
- Genuine failures are confined to the non-technical `explain` cases: `explain-12` (uses `GET`) and
  `explain-14` (uses `recursive`) fail in every repetition; `explain-10` leaked `allocat` in one
  repetition and passes on majority. These are real audience failures and are retained.

Limitations: the reviewer is an independent AI reviewer, not a human; the release contract's
"human factuality scoring" should be satisfied by the owner at RELEASE-01 if a human pass is
required. Rubric data is synthetic and single-model, single-machine.

## Prior evidence (superseded)

Earlier full runs on plain `core.json` are recorded in `evals/results/full-20260914/`; earlier screens, the pre-prompt-change 1.5B runs and the prompt/definition experiments are in `evals/results/*.json`. Screens were development-split, 1 rep and are not comparable to the runs above. The Qwen3.8 27B IQ4_XS signal is a 3-example development screen and requires > 12 GiB.

## Acceptance criteria

| Criterion | Result |
| --- | --- |
| All required semantic thresholds met or release blocked | PASS — semantic gate (filter/classify/extract) and all five rubric families pass on gemma-4-e4b |
| Unsupported hardware requirements visible | PASS — gemma peaks ~5.8 GB, fits 12 GiB |
| No claim that a model is fast without environment | PASS — environment and per-run resource measurements recorded |

Reviewer decision: ACCEPTED (deterministic floor and independent reviewer pass both ≥ 85 % in every family; rank ground-truth ambiguity and non-technical jargon findings documented).
