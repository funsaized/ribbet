# Model selection

Status: v1 default selected 2026-09-15. Evidence: `docs/delivery/evidence/EVAL-02.md`.

## Selected default

| Field | Value |
| --- | --- |
| Provider / profile | LM Studio (`lmstudio`), profile `local-gemma` |
| Model key | `gemma-4-e4b` (`google/gemma-4-e4b`) |
| Source | `lmstudio-community/gemma-4-E4B-it-GGUF` |
| File | `gemma-4-E4B-it-Q4_K_M.gguf` |
| Quantization | Q4_K_M (verified from the GGUF filename) |
| Parameters | 7.5B |
| On-disk size | 6.33 GB |
| Context used in evaluation | 8192 |

## Measured quality

Three independent full runs, 250 frozen fixtures × 3 repetitions = 750 attempts each,
using the described-label variant of `evals/datasets/core.json`.

| Metric | Run 1 | Run 2 | Run 3 | Mean | SD |
| --- | --- | --- | --- | --- | --- |
| Filter macro-F1 | 1.000 | 1.000 | 1.000 | 1.000 | 0.000 |
| Classify macro-F1 | 1.000 | 1.000 | 1.000 | 1.000 | 0.000 |
| Extraction field correctness | 0.922 | 0.931 | 0.904 | 0.919 | 0.011 |

All three gates (≥ 0.90) pass in every run, with zero harness errors in 9,000 attempts
across the four evaluated candidates. It is the only candidate that passes at all.

## Measured resources

Reference: RTX 3080 Ti 12 GiB, 32 CPU cores, Linux.

| Measurement | Observed |
| --- | --- |
| VRAM | ≈ 5.6–6.0 GB resident |
| GPU temperature | ~78–82 °C sustained, 83 °C peak |
| GPU power | up to ~349 W |
| Latency | ~1.7–3.0 s per structured request idle; up to ~5 s under host CPU contention |
| CPU | not a bottleneck; whole-battery CPU stayed under 47 % |

## Candidates not selected

| Model | Filter | Classify | Extract | Reason |
| --- | --- | --- | --- | --- |
| Qwen2.5 1.5B Q4_K_M | 0.876 | 0.883 | 0.981 | Fails filter and classify (best run .906 filter was an outlier) |
| Qwen3.5 9B (Ollama native) | 0.832 | 1.000 | 0.998 | Fails filter; conservative, mostly false negatives |
| Qwen2.5 0.5B Q4_K_M | 0.340 | 0.852 | 0.747 | Fails all gates |
| Qwen3.8 27B IQ4_XS | — | — | — | Development-screen only (3 examples); needs > 12 GiB |

The 27B has no full evaluation and does not fit the reference card. Deeper model
investigation is deferred until after v1.

## Configuration

```
ribbit profiles set local-gemma --provider lmstudio --model gemma-4-e4b --max-output-tokens 2048
```

Select it globally by editing the `default` block in
`${XDG_CONFIG_HOME:-$HOME/.config}/ribbit/config.yaml`:

```yaml
default:
  profile: local-gemma
```

There is no CLI flag for the global default; the config file is authoritative.
`maxOutputTokens` is 2048 — the lower 256/512 caps on the smaller test profiles truncate
structured output.

## Known limits

- Quality is measured on synthetic fixtures with cross-split template overlap. This is not
  evidence of broad out-of-distribution generalisation.
- Rubric families (`rank`, `group`, `reduce`, `compare`, `explain`) were evaluated 2026-09-15 and
  pass: deterministic floor 97.8 / 100 / 100 / 100 / 91.1 % and independent reviewer 100 / 100 / 100 /
  100 / 90.0 % respectively (see `docs/delivery/evidence/EVAL-02.md`). The `explain` shortfall is
  non-technical audience cases leaking jargon.
- Numbers are single-machine and single-GPU; other hardware may differ.
- The evaluated model is text-only for Ribbit's purposes; the multimodal projector shipped
  alongside it is unused.

## Reproducing

```sh
RIBBIIT_RUN_LIVE_EVAL=1 RIBBIT_EVAL_PROFILE=local-gemma \
  bun run scripts/evaluate.ts
```

Set `RIBBIT_EVAL_DATASET` to a described-label variant to reproduce the exact configuration.
