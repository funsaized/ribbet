# Model evidence and route selection

Choose routes per task. There is no universal small-model default and no hardware-independent quality claim. The current local regression compares an installed Qwen2.5 0.5B Q4_K_M (`ribbit-release-small`, 4096 loaded context) with Gemma 4 E4B Q4_K_M (`google/gemma-4-e4b`, 8192 loaded context), through LM Studio on this Linux workstation. Both model files were already installed; no model download was performed.

The runner uses temperature 0, at most 2048 output tokens, 30-second requests, 90-second command budgets, and three repetitions. Quantization is identified from the installed filenames; file digests, runtime, and hardware provenance are in [environment evidence](../evals/results/release-environment.json). Token usage may be unknown because the provider did not report it; unknown is not zero.

Stronger report: [raw report](../evals/results/release/2026-09-20T14-51-55-840Z-google_gemma-4-e4b/report.json). Small report: [raw report](../evals/results/release/2026-09-20T14-55-34-078Z-ribbit-release-small/report.json). [Individual acceptance](release-acceptance.md) breaks down every command and optional mode.

| Semantic command | Stronger passing attempts | 0.5B passing attempts |
| --- | --- | --- |
| ask | 6/6 | 3/6 |
| classify | 3/3 | 1/3 |
| compare | 3/3 | 3/3 |
| explain | 3/3 | 3/3 |
| extract | 3/3 | 3/3 |
| filter | 3/3 | 0/3 |
| find | 3/3 | 1/3 |
| group | 3/3 | 0/3 |
| map | 6/6 | 6/6 |
| pick | 3/3 | 3/3 |
| rank | 3/3 | 3/3 |
| reduce | 6/6 | 3/6 |
| rewrite | 3/3 | 3/3 |
| summarize | 3/3 | 3/3 |
| tree | 6/6 | 4/6 |

The stronger model previously exhausted a 512-token allowance on explain, reduce, and compare. Those failed runs remain recorded; the 2048-token experiment is a different explicit resource configuration. Template-specific thinking controls are not universally honored. A small visible answer can still require substantial internal generation.

The 0.5B model is unsuitable as an automatic filter on this evidence: it repeatedly retained the wrong record. Its grouping, adversarial instruction handling, and chunked reduction also failed cases. Passing simple extraction or summarization fixtures does not establish suitability for arbitrary inputs. Prefer preserved originals and annotations when a downstream reviewer must catch mistakes.

## End-to-end comparison

Workflow evidence: [raw report](../evals/results/workflows/2026-09-20T14-55-49-560Z/report.json). The same three fixture jobs were run local-only, direct-stronger, and mixed, three times each. All stages and full outputs are recorded. Downstream bytes measure evidence bytes at the final model boundary, not tokens.

| Recipe | Route | Passes | Mean wall time (ms) | Mean final evidence bytes |
| --- | --- | --- | --- | --- |
| triage | local-only | 3/3 | 1258 | 638 |
| triage | direct-stronger | 3/3 | 8949 | 545 |
| triage | mixed | 3/3 | 12360 | 637 |
| context | local-only | 3/3 | 771 | 816 |
| context | direct-stronger | 3/3 | 6727 | 760 |
| context | mixed | 3/3 | 8696 | 816 |
| brief | local-only | 3/3 | 275 | 75 |
| brief | direct-stronger | 3/3 | 2973 | 90 |
| brief | mixed | 3/3 | 3706 | 75 |

Interpret these as observations on tiny fixtures and an uncontrolled shared workstation, not benchmark rankings. The annotation-based recipes retain all evidence and can increase final context size and latency. A direct stronger-model call is often simpler. The brief recipe reduces text volume but can lose facts; its floor checks names, dates, and amounts. No monetary savings or general quality improvement is established.

## Harness boundary

Live Codex handoff: [raw report](../evals/results/handoff/2026-09-20T14-58-06-865Z/report.json). PASS: the local harness consumed the record stream and returned the required source names and expiration condition. This is one bounded read-only interpretation task, not an evaluation of autonomous coding or tool-use reliability.

## Limits and reproduction

These are public, authored regression cases. They are not held out, were not independently reviewed, and use deterministic fact checks as a floor. Older synthetic datasets and their reviews are retained as historical evidence, not current cross-domain validation. Model suitability remains experimental until diverse held-out tasks and independent review support broader claims.

Run `npm run eval:release -- --help` for per-command selection. `--mode smoke` runs every selected case once; `--mode full` repeats them three times. The [evaluation guide](../evals/README.md) documents local-only opt-in, raw attempt retention, recipe comparisons, and harness checks.
