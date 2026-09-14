# EVAL-02 — BLOCKED 2026-09-14

Environment: Linux, RTX 3080 Ti 12 GiB, Bun 1.4.0, LM Studio and Ollama OpenAI-compatible/native loopback. Gates: all three of filter macro-F1, classify macro-F1, extraction field correctness ≥ 0.90.

## Candidate models — full held-out runs (750 attempts, 3 reps, frozen `evals/datasets/core.json`)

| Model | Filter F1 | Classify F1 | Extract |
| --- | --- | --- | --- |
| Qwen2.5 0.5B Q4_K_M | .332 | .524 | .749 |
| Qwen2.5 1.5B Q4_K_M (pre-prompt-change) | .855 | .651 | .984 |
| Qwen2.5 1.5B Q4_K_M (explicit-label variant — since reverted) | .333 | .444 | .987 |

## Screens — development split only, 1 rep (not comparable to the runs above)

| Model | Filter | Classify | Extract |
| --- | --- | --- | --- |
| gemma-4-e4b 7.5B Q4_K_M | .944 | .867 | .400 |
| Qwen3.8 27B IQ4_XS | 1.000 | 1.000 | 1.000 |

Raw: `evals/results/{qwen2_5-0_5b-instruct,qwen2_5-1_5b-before-label-prompt-fix,qwen2_5-1_5b-instruct}.json`, `gemma-4-e4b-screen.json`, `ribbit-qwen27b-screen.json`.

## Prompt/definition experiments on 1.5B (full 750)

Diagnosis from the attempt logs: zero parse/validation errors in 900 filter+classify attempts, so the harness was sound; failures were semantic. The explicit-output filter variant collapsed to all-negative (150/150 positives predicted false). Label descriptions were tested with a dataset variant generated from `core.json` where classify `--labels` carries `name=description` (bug, feature, praise, unknown each given one plain sentence; not committed, regenerated per run).

| Variant | Filter | Classify | Extract |
| --- | --- | --- | --- |
| Reverted filter + classify reason-first, no descriptions | .810 | .657 | .973 |
| + label descriptions v1 | .824 | .826 | .964 |
| + label descriptions v2 (best) | .858 | .850 | .987 |
| + label descriptions v3 | .824 | .836 | .989 |

Findings: reverting the filter prompt restored it from .333 to .81–.86. Label descriptions fixed `unknown` (0/75 → 75/75) and kept `feature`/`bug` at 100%; `praise` still maps to `feature` (34/75). Best 1.5B is `.858/.850/.987` — still below the .90 classify and filter gates.

## Qwen3.5:9B (Ollama, native)

Protocol smoke passed. As a thinking model it emitted >1024 tokens per structured request and tripped the `finish_reason` guard; adding the provider `reasoning` capability (`think:false`) cut a call to ~42 tokens and <1 s. A full run was interrupted by the owner at ~150/750 with zero errors and is **not scored**. This is the most promising untested candidate.

## Open owner decision

No small model has passed .90. The only passing signal is 27B on a 3-example development screen, and it needs >12 GiB. Options: block release; accept a larger candidate with a documented hardware requirement; or continue with the 9B. Rubric-family evaluation (`scripts/evaluate-rubrics.ts`) is written but not yet run.

| Criterion | Result |
| --- | --- |
| All required semantic thresholds met or release blocked | FAIL on small models; 9B unscored |
| Unsupported hardware requirements visible | PASS |
| No claim that a model is fast without environment | PASS |

Reviewer decision: BLOCKED.
