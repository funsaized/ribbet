# Quick screen to review

Run started: 2026-09-13T22:40:05.443Z. Model: **Unsloth Qwen3.8-27B-UD-IQ4_XS**, alias `ribbit-qwen27b`.

**Result: 3/3 context retrieval checks and 30/30 labeled quality cases passed.** This is a small diagnostic screen, not release acceptance.

## Setup and method

RTX 3080 Ti (12 GiB), Ryzen 9 5900XT, 32 GiB RAM. Existing LM Studio installation, local OpenAI-compatible endpoint at `127.0.0.1:1234/v1`. Loaded with 8192 context, 40% GPU weight offload, Flash Attention, Q4_0 K/V cache, one prediction slot and 128-token prompt batches. Engine-reported load settings are retained in the raw results. The model SHA-256 is `40fac4050e940397dbf13087afd50f4734a11805bf9d65ef8ddd7483470e6199`.

Retrieval used three distinct codes placed near the beginning, middle and end of synthetic archive filler. Input size was checked with the model tokenizer; server usage includes the chat template. Requests used temperature .6, top-p .95, top-k 20, min-p 0, repeat penalty 1, presence penalty 0, low reasoning effort and a 256-token output cap. Nonstandard sampling fields were sent; their receipt does not prove every server-side setting was applied.

Quality used the first 10 held-out fixtures per command from `evals/datasets/core.json`: filter-20–29, classify-20–29, extract-10–19. These ran through the actual Ribbit engine, its current prompts, schema validation and `local-27b` profile (temperature .6, output cap 2048). Ribbit does not currently send reasoning effort or the other preset sampling knobs. Budgets allowed two requests, 45 seconds per request and 60 seconds per case. No prompt or profile tuning occurred during this screen.

## Context retrieval

| Answer position | Server input tokens | First token, incl. reasoning | First answer token | Total | Correct |
| --- | ---: | ---: | ---: | ---: | --- |
| beginning | 7045 | 46.39s | 69.88s | 70.92s | Yes |
| middle | 7044 | 46.79s | 60.81s | 61.85s | Yes |
| end | 7044 | 46.34s | 61.41s | 61.93s | Yes |

First token counts reasoning text, not just the visible answer. Each request returned the exact expected code. Timings are individual observations from one model load, not cold-start benchmarks or statistical performance estimates. Prefix caching was not disabled.

## Labeled quality

| Command | Exact cases correct | Mean latency | Range | Repairs / retries |
| --- | ---: | ---: | ---: | ---: |
| filter | 10/10 | 18.50s | 12.37–23.44s | 0 / 0 |
| classify | 10/10 | 15.63s | 12.28–24.31s | 0 / 0 |
| extract | 10/10 | 28.87s | 20.21–34.89s | 0 / 0 |

Extraction field correctness: **30/30**. Exact-case scoring requires all three fields to match, including null values.

## Memory and practical interpretation

Minimum sampled free VRAM: **3017 MiB (2.95 GiB)**, sampled approximately once per second across the run. Reserve violation: **False**. Sampling can miss brief peaks; this is not a hard allocation cap.

Summed request time: **13.75 minutes**, excluding loading, tokenization and orchestration. The initial 5–10 minute estimate was optimistic for this setup.

Keep the current 8K/Q4/40%-offload configuration as a candidate for further testing. It handled these cases correctly while preserving desktop VRAM headroom, but latency is substantial. Before increasing offload or context, test explicit low reasoning effort on the same quality cases; the current application leaves that setting unspecified. Do not change the default model based solely on this small screen.

## Limits and follow-up

- One pass per case, no fixed seed, only 30 templated held-out examples. Templates overlap with development data; the split is not strong evidence of generalization.
- Simple code retrieval does not establish long-document reasoning, codebase understanding, tool-use reliability or 112K-context capability.
- No failures required the planned FP16 diagnostic rerun. Q4-versus-FP16 quality equivalence remains untested.
- Earlier small-model evaluations used a larger sample and repetitions. These results are not a matched comparison or a pass of the release quality gate.
- No steady-state tokens-per-second claim: request timing includes prompt processing and reasoning. Quality time-to-first-token was not instrumented.

## Reproduction and evidence

Start the LM Studio server, run `node scripts/lmstudio-qwen27b.mjs --load`, then `bun run scripts/quick-screen.ts`. The runner overwrites its raw result file; preserve this run before repeating.

- [Raw per-case results and observed load configuration](evals/results/quick-screen.json)
- [Screen runner](scripts/quick-screen.ts)
- [Guarded setup](docs/lmstudio-qwen27b.md)

Shutdown verified: the screen process exited successfully, LM Studio daemon reports `not-running`, and free GPU memory returned to 10321 MiB. The pre-existing Ollama service was left untouched.
