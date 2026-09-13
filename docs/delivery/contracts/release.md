# Release contract

Status: PROPOSED for implementation planning. The corresponding CONTRACT task must ratify this baseline with evidence; this document does not imply user approval of unpublished details.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

## 13. Performance, limits and quality (R-PERF)

Proposed release budgets, to be ratified with reference hardware before implementation expands:

| Measurement | Initial gate |
| --- | --- |
| CLI help/version warm-cache process p95 | <=100 ms, excluding shell startup |
| Deterministic take/select over 100k small records | Bounded streaming memory; <=128 MiB incremental RSS on reference runner |
| Deterministic extension invocation p95 overhead | <=150 ms excluding user logic; measured cold and warm |
| Managed invocation overhead before HTTP request | <=100 ms warm-cache p95 |
| Requests on exact ls/tree/pick/sort/select/unique/take/render | Zero |
| Schema adherence on emitted structured results | 100%, otherwise command fails |
| Record identity/permutation and routing conformance | 100% deterministic suite pass |
| Filter/classify semantic fixture macro F1 | >=0.90 on >=100 labeled examples per task |
| Extraction field correctness | >=0.90 on >=50 fixtures; schema validity alone insufficient |
| rank/group/reduce/compare/task explanations | >=85% rubric pass on >=30 cases per family; disclose model variance |
| Agent authoring evaluation | >=8/10 tasks completed from public docs/schema with no runtime source inspection |
| Setup pilot | >=4/5 target users complete a documented local first-run within 10 minutes excluding model download |

These are acceptance targets, not measured claims. Report first attempt and repaired results separately. Model evals run at least three repetitions with model identifier/digest where available, quantization, runtime, hardware, context, tokens, request count, and latency. Choose a small quantized default by actual quality/latency results; do not promise a particular model today. Keep a larger local option documented. Setup pilot is owner-arranged; simulated users do not count.

Default operational limits for the reference contract: 8 MiB raw input, 10,000 records for streaming operations, 200 records for global semantic rank/group, 100 inspected files for semantic tree/find, 60 seconds per inference request, 120 seconds total per command, one concurrent local request, one schema repair. Effective context limits can be tighter and must fail early when known. Configured increases remain subject to model context and explicit total request/token budgets. Exact streaming commands need not share semantic byte limits; their limits are separately documented. Limits are tunable but finite by default. --stats reports routing, times, requests, token usage if supplied, and unknown usage as unknown. Cost is omitted unless backed by explicit user-supplied rates. No telemetry by default; content caching is off in v1. Model residency belongs to the provider.


## 14. Delivery and platform

Initial supported targets: macOS arm64 and Linux x86_64; Linux arm64 and Windows/PowerShell are follow-up unless the runtime spike proves them effectively free. Bash/zsh/fish examples; no platform-specific shell substitution in normative examples. One installable CLI distribution with an embedded or explicitly declared TS execution runtime; end users should not install a compiler for ordinary built-ins. Runtime decision is gated by extension loading, cold startup, packaging and maintenance evidence, not language preference. No Rust-plus-TS split required before benchmarks justify it.

Local setup needs an existing provider or explicit provider/model installation instructions. Config follows XDG on Linux and a documented platform convention on macOS; project file .ribbit.yaml, definitions under commands/, extension sources under extensions/, flows under flows/. Generated build/cache/lock material has an explicit location and must not pollute source. Lockfile is tracked; generated caches are not. Read-only help works outside an initialized project.


## 15. Acceptance, risks and launch

Release requires accepted behavior contracts, all required command tasks, routing conformance, extension consumer tests, platform install smoke tests, semantic evals, measured performance, docs/examples executed against the release candidate, and owner-arranged pilot evidence. Publication is a separate owner action after a ready-to-review release bundle exists. Work may complete to release-ready while publication remains blocked by stealth status.

Risks: small models may miss quality gates; large inputs may exceed context; schema validity can mask incorrect extraction; executable extensions may cause side effects; TS loading may defeat startup targets; dynamic providers vary in schema support; a wide command set may confuse users. Mitigations: task-specific evals, explicit bounds, provenance, trusted-install model, measured runtime spike, capability contracts, and grouped help with examples. Any gate adjustment requires a recorded rationale and an owner scope decision; never weaken tests quietly.

Success after release is measured through voluntary user interviews and opt-in reports: recurring weekly use of at least one workflow, successful extension reuse, and low manual format repair. No adoption claims are made from synthetic agent runs. Naming and domain validation remain separate owner tasks.
