# Integrated CLI delivery — 2026-09-13

Revision: the commit containing this evidence; inspect `git log --oneline` for the exact revision. Linux x86_64, Ryzen 9 5900XT / 32 GiB, Bun 1.4.0 / TypeScript 5.9.3. Native Mac smoke: `saiguy@mini`, Apple M1 / 16 GiB, packaged Bun 1.4.0. Original planning source documents are preserved.

## Delivered implementation

- All 22 public commands execute through the shared SDK engine and generated catalog.
- Explicit trusted extension scaffold/check/test/add/list/remove, content hashes, immutable bundles, stale-source rejection and transactional registry activation.
- Generated CLI positional/scalar/repeated/JSON arguments, runtime flags, versioned errors and clean stdout behavior.
- Provider/profile management, local Ollama and LM Studio discovery, route inspection, doctor and shell completion.
- Strict named YAML definitions, exact versions and explicit namespaces; linear saved/inline flows, typed references, preflight checks, streaming/materialization and shared limits/routes.
- Filesystem ignores, bounded reads, symlink/root controls, actual candidate identity and controlling-terminal fzf transport.
- Linux/macOS compiler-inclusive distributions with local SDK support, public docs and packaged deterministic examples.

## Verification mapping

| Area | Executed verification | Result |
| --- | --- | --- |
| Type safety | npm run check | PASS |
| Records/budgets/SDK/routes/providers | npm run test:unit | PASS |
| Manifests/parser | tests/manifests and tests/cli/parser.test.ts; byte-identical regeneration twice | PASS |
| Extension lifecycle | tests/extensions/lifecycle.test.ts | PASS |
| Built-in semantic/exact contracts | tests/builtins; mocked model responses clearly separate from live quality | PASS |
| Filesystem | tests/filesystem/traversal.test.ts | PASS |
| Definitions/flows | tests/definitions, tests/flows, CLI pipeline tests | PASS |
| Public SDK consumer | npm run test:consumer | PASS |
| HTTP cancellation | npm run test:conformance with loopback socket permission | PASS |
| Package authoring | npm run package:smoke; native Mac scaffold/check/test | PASS |
| Real picker | python3 scripts/picker-smoke.py | PASS selection, hostile label and cancel |
| Documentation | npm run test:docs | PASS links and deterministic packaged examples |
| LM Studio live | provider-lmstudio-live.json; default CLI invocation | PASS transport/schema; model instruction quality is not assumed |
| Semantic quality | 750 live attempts; evals/results/latest.json | FAIL: filter .332, classify .524, extraction .749 versus .90 |
| Warm startup | benchmarks/latest.json | PASS after compiler split; other performance gates separate |

The initial Mac authoring check failed because TypeScript's library path pointed at the build host. The corrected distribution carries the compiler libraries and supplies an explicit compiler host library path; the repeated native check passed. The first startup benchmark failed about 109 ms p95; moving the compiler to the local authoring sidecar reduced it to about 39 ms. These failures were addressed without reducing workloads or gates.

## LM Studio consolidation

The user's Omarchy desktop installation shares `~/.lmstudio` with `lms`. Desktop ownership was verified initially; after the desktop service was no longer active, `lms` started its headless fallback. The final status is one headless service (PID 1073491), using the same model library and loopback API. The desktop application remains installed; no duplicate model library is required. Qwen2.5-0.5B-Instruct Q4_K_M is about 469 MiB and is configured as `local-test` at loopback port 1234. The user-installed Ollama Qwen3.5:9b remains intact. Its GGUF was not compatible with the tested LM Studio engine; only the temporary LM Studio import link was removed. The test model failed quality gates and is not an accepted release default.

## Remaining acceptance and blockers

Hosted OpenAI-compatible live conformance needs an owner-specified endpoint, model and API-key environment variable. Independent agent evaluation needs authorization; five-user pilots require real owner-arranged participants. Synthetic fixtures need independent label/rubric review. The small test model fails core semantic thresholds; a candidate comparison is still required before selecting a release default.

Task groups in REVIEW have connected implementations and tests, but not a complete per-criterion acceptance audit. In particular, complete flow route/effect snapshots, exhaustive adversarial matrices, extension cold/warm and managed pre-HTTP benchmarks, macOS timing, all live documentation examples and private release audit remain unfinished. They are not claimed as passed. Release and publication remain blocked.
