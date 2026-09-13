# Qwen3.8 27B desktop setup

Requested model: [Unsloth Qwen3.8-27B UD-IQ4_XS](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF/tree/main), approximately 14.3 GB. The actual workstation is an RTX 3080 Ti **12 GiB**, Ryzen 9 5900XT and 32 GiB RAM. The quoted 16 GiB 5070 Ti configuration is not directly applicable; full GPU residency does not fit here.

The tracked preset is [qwen38-27b-desktop.json](../config/lmstudio/qwen38-27b-desktop.json). It starts at 8192 context tokens, 40% weight offload, Flash Attention, Q4_0 key/value cache, one prediction slot, small prompt batches and a 900-second idle unload. It requires 2 GiB free VRAM headroom. GPU offload ratio is not a hard VRAM percentage; the launcher checks an estimate before load and measured free memory afterward, unloading on violation. Other applications can still change memory availability afterward.

Prediction settings are saved separately: temperature 0.6, top-p .95, top-k 20, min-p 0, repetition penalty 1, presence penalty 0, eight CPU threads. These are requested settings, not a claim of measured quality or throughput. Ribbit's profile sends temperature; the other sampling settings must be selected in LM Studio or supplied by a client supporting them. They are not silently claimed to have been applied to every OpenAI-compatible request.

No raw llama.cpp fit/fitt/ngl overrides are injected. The 112K/131K context and full-VRAM settings are intentionally replaced by a conservative starting point. Reasoning-preserve has no verified equivalent in this setup. LM Studio documents [load configuration and KV cache quantization](https://lmstudio.ai/docs/typescript/api-reference/llm-load-model-config); Q4 value cache needs Flash Attention and quality must be measured for this model.

Tomorrow, from the project directory:

```sh
~/.lmstudio/bin/lms server start --bind 127.0.0.1 --port 1234
node scripts/lmstudio-qwen27b.mjs --show
node scripts/lmstudio-qwen27b.mjs --estimate
node scripts/lmstudio-qwen27b.mjs --load
./dist/ribbit ask 'Explain this briefly' --file README.md --profile local-27b
```

The launcher uses the SDK already bundled with this LM Studio install; it does not download runtime code. `LMSTUDIO_SDK_PATH` can point to a relocated SDK index.mjs. It loads the model as `ribbit-qwen27b`; this explicit alias prevents the profile from silently selecting a different model. If the estimator or engine rejects the architecture/cache settings, stop and inspect the error before changing settings. Do not assume the anecdotal 40–50 TPS applies to this GPU.

The model is left unloaded at the end of this session. The first load and an OpenAI-compatible generation smoke test passed: the engine reported Q4_0 K/V, Flash Attention, 8192 context and .4 offload. Free VRAM was 3552 MiB after loading and at least 3516 MiB during the short generation. The exact response was `Model ready`; 30 completion tokens (including reasoning) took 5.72 seconds end to end. This is a smoke test, not a throughput benchmark. Long-context memory behavior and Q4 KV quality comparison remain unverified.

## Quick follow-up screen

Allow roughly 5–10 minutes, depending on prompt processing speed: three retrieval prompts near 7K tokens with distinct known answers at the beginning, middle and end, followed by 30 existing labeled filter/classify/extract examples. Record correctness, time to first token, total latency and minimum free VRAM. Repeat failures with FP16 KV only after its memory estimate passes the reserve guard. Compare identical prompts and sampling settings; a single stochastic difference does not establish a cache defect. This screens the configured 8K context, not 112K capability or release quality. Stop and unload if headroom drops below 2 GiB.

The follow-up screen was executed: see [QUICK_SCREEN_TO_REVIEW.md](../QUICK_SCREEN_TO_REVIEW.md) for results and timing. It took 13.75 minutes of request time, longer than the initial estimate. All 33 checks passed with at least 3017 MiB sampled free VRAM.

## Desktop entry

The original download appears as **Qwen3.8 27B UD**. “No loaded models” means it is on disk but not occupying inference memory.

A configured local model entry is now installed at `~/.lmstudio/hub/models/ribbit/qwen38-27b-desktop-8k/` and appears as **Qwen38 27B Desktop 8k** (`ribbit/qwen38-27b-desktop-8k`). Select this entry for desktop chats. It reuses the existing GGUF; there is no second weights download. Its [model definition](../config/lmstudio/model.yaml) saves the tested load settings and sampling defaults including eight CPU threads. This follows LM Studio's [model.yaml configuration mechanism](https://lmstudio.ai/docs/app/modelyaml).

A load with no SDK configuration overrides verified 8192 context, .4 offload, strict VRAM cap, Q4 K/V, Flash Attention, one slot and 128-token batches. See [observed load config](../config/lmstudio/desktop-verified-load.json). The verification instance was unloaded afterward. The desktop remains open; its temporary HTTP server was stopped. The desktop entry does not run the launcher's extra pre/post-load 2 GiB checks; keep other GPU workloads in mind and use the guarded launcher when those checks are wanted. Existing chat-level overrides can supersede sampling defaults.

The standalone headless CLI can conflict with the desktop's service authentication during ownership changes. Use the CLI bundled with the running desktop when working on its service, and avoid starting a competing llmster instance.
