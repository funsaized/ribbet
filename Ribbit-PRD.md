# Ribbit — Product requirements document

Historical planning baseline · 2026-09-13 · Selected name; availability unverified

The current product direction is [composable model work](docs/product-direction.md). Current acceptance and remaining release decisions live in the [release checklist](docs/release-checklist.md). This document preserves the original proposed contracts and scope; its future-tense claims and private delivery gates are historical, not a current readiness declaration.

## 1. Product decision

Ribbit is a performance-first, local-first semantic shell toolkit. Humans use readable commands and ordinary pipes. Coding agents inspect schemas, configure commands in YAML, and implement new command types as TypeScript functions with Zod contracts. Both use the same execution engine and provider routing.

Product promise: **Small commands. Big hops.**

Brand direction: Ribbit is a small, clever frog helping people work in the terminal. The tone is playful, concise, and technically precise. Use `ribbit` for the executable, `@ribbit/sdk` for the SDK, `.ribbit.yaml` for project configuration, `ribbit/v1` for document schemas, and `$ribbit` for the record wire marker. These are proposed identifiers, not claims of package or name availability. Frog imagery belongs in identity and examples; command names, errors, and machine-readable output stay clear and literal.

This PRD specifies the complete initial release, including 22 commands. Delivery milestones are implementation increments, not permission to silently cut the initial scope. All behavior is proposed; no implementation, benchmark, user validation, or name availability verification is claimed. The project remains private until its owner explicitly authorizes publication.

## 2. Problem and opportunity

Traditional shell tools handle exact text and structured values well. Interpreting intent, extracting meaning from inconsistent text, and summarizing information usually require opening a chat UI, constructing a prompt, copying results, and repairing their format. Generic LLM wrappers provide access to inference but leave scripts to manage validation, record identity, provider selection, and reusable behavior.

Ribbit turns those repeated tasks into inspectable operations. Its distinct value is the combination of a broad familiar CLI, typed composition, agent-authored executable extensions, local-first inference, and command-specific routing. Natural language is used where semantic judgment is needed; filesystem traversal, fuzzy selection, field projection, formatting, and exact sorting remain deterministic.

## 3. Users and jobs

| Persona | Primary job | Success signal |
| --- | --- | --- |
| Developer in a shell | Inspect a codebase, explain errors, turn diffs into useful text | Completes work without leaving the pipeline |
| Engineer handling logs or feedback | Filter, classify, prioritize, and aggregate records | Original records and source references survive processing |
| Coding agent | Discover a capability, configure it, add missing logic, validate and run | Uses exported contracts without reading runtime internals |
| Extension author | Package reusable domain logic | One implementation works through CLI, YAML, and flows |
| Local-model user | Use existing local inference with bounded resource use | No account or hosted endpoint required |

Initial focus: developer-oriented UTF-8 text, source code, logs, notes, filesystem metadata, and JSONL. Broad document conversion and operational infrastructure automation are outside v1.

## 4. Goals and non-goals

### Goals

- G1: Ship all 22 initial commands with explicit semantics and useful help.
- G2: Author built-ins and extensions through the same TypeScript/Zod contract.
- G3: Support reproducible YAML command definitions and linear flows.
- G4: Default to local inference and allow provider/model overrides on each command and flow step.
- G5: Preserve shell correctness: stdout data, stderr diagnostics, stable exits, cancellation, bounded resources.
- G6: Make command discovery, validation, errors, and scaffolding accessible to coding agents.
- G7: Measure startup separately from inference and measure semantic quality alongside latency.
- G8: Install and operate privately without accounts, telemetry, or runtime code downloads.

### Non-goals

Autonomous shell execution, file mutation commands, reminders, browsing/crawling, PDF/OCR/audio/image ingestion, vector indexing, arbitrary DAGs, loops in YAML, distributed workers, automatic cloud fallback, plugin marketplace, mandatory artifact database, full shell replacement, and an embedded model inference engine. TypeScript extension logic may branch; declarative flow orchestration stays linear. Installed executable extensions are trusted code in v1, not a sandboxed plugin marketplace.

## 5. Initial use cases

### U1: Understand a codebase

`ribbit tree src --depth 3 --describe --read content`

Actual filesystem topology is rendered with short generated descriptions. Path names are never generated. Evidence budgets and omitted files are reported. `--about` narrows relevance while preserving ancestors.

### U2: Choose relevant files

`ribbit find src --about "Request validation" --read content | ribbit pick --multi`

Semantic candidate selection feeds a lexical interactive picker. `pick --about` can rank supplied records before interaction. Noninteractive agents use `rank --top`.

### U3: Summarize noisy logs

`cat app.log | ribbit filter "Timeouts or connection failures" --input lines | ribbit reduce "Summarize recurring failures and supporting evidence"`

Matches retain exact content and identity. The reduction separates observations from hypotheses.

### U4: Structured meeting output

`ribbit extract "Decisions and action items" --file meeting.md --schema meeting.schema.json | ribbit render --template meeting-summary.txt`

Extraction is schema-validated; deterministic rendering requires no extra inference.

### U5: Mixed-route feedback triage

`cat feedback.jsonl | ribbit filter "Concrete product problems" --input jsonl --field body --profile local-fast | ribbit rank "Urgent actionable bugs" --field body --top 10 --profile cloud-quality`

Each process owns its route. No step inherits a previous process's cloud selection.

### U6: Agent-authored command

An agent lists types, reads a schema, scaffolds TypeScript only when required, adds fixtures, checks the extension, creates a YAML definition, and runs it with typed arguments. A human reviews ordinary source files and test evidence.

## 6. Public command inventory

Flags below are command-specific additions to shared runtime flags. Positional descriptions are ordinary quoted shell arguments, never executable shell text.

| ID | Command | Inputs and key options | Output and required semantics |
| --- | --- | --- | --- |
| C01 | ask | Optional instruction plus stdin/--file; instruction required unless definition supplies it; --rule repeatable | Text answer; no tool execution |
| C02 | summarize | Text or records; --words positive integer, --rule | Concise text; word count is an enforced maximum using documented whitespace token counting |
| C03 | explain | Text/code/errors; optional focus; --audience | Text explanation; uncertainty explicit; no claims of execution |
| C04 | rewrite | Instruction plus text; --rule | Rewritten text; preserve supplied facts unless transformation explicitly changes them |
| C05 | extract | Instruction, --schema local JSON Schema file | Validated JSON; missing facts follow null/empty schema allowances; unsupported schemas fail before inference |
| C06 | classify | Records; --labels comma-separated simple labels or repeated --label; --field | Original record with one allowed label; optional user-declared unknown label; never invent a class |
| C07 | filter | Predicate instruction; records; --field | Exact matching records, stable order; semantic decisions are fallible |
| C08 | rank | Criterion; records; --top positive integer; --field | Original records reordered; no omitted/duplicated IDs before top slicing; no fabricated numeric confidence |
| C09 | group | Criterion; records; --field | Objects containing group ID, generated label, member records/IDs; each input belongs to exactly one group in v1 |
| C10 | map | Instruction; records; optional --schema | Exactly one result per record with lineage; validated structured results if schema supplied |
| C11 | reduce | Instruction; text or records | One text result; explicit --strategy chunked allows hierarchical reduction with recorded chunk boundaries |
| C12 | compare | Exactly two file paths; --focus | Text comparison labeled with both sources; neither file is modified |
| C13 | ls | Root path default cwd; --recursive, --hidden, --glob | Filesystem records: path, kind, sizeBytes, modifiedAt; zero inference |
| C14 | find | Root; --glob, --kind, --about, --read names\|content | File records; deterministic prefilter before optional semantic filtering |
| C15 | tree | Root; --depth, --describe, --about, --read names\|content | Human tree by default, structured tree on request; metadata-only mode needs no provider |
| C16 | pick | Records; --multi, --query, --about, --label | Selected original records; UI on controlling terminal; stdout only selections |
| C17 | read | One or more explicit text paths | File records with content and source boundaries; never executes content |
| C18 | select | Comma-separated field paths | Project record value fields; missing field errors unless --missing null |
| C19 | sort | --by path; --descending; --type number\|string | Stable exact sort; missing/mixed invalid values fail; no inference |
| C20 | unique | Optional --by path | First record for each exact key/value; canonical JSON equality with sorted object keys |
| C21 | take | Nonnegative integer count | First N records, stops upstream work early; zero consumes no records |
| C22 | render | --as text\|table\|json\|jsonl or --template path | Final display values; safe template substitution only, no eval or shell execution |

Public record field selectors address `record.value` by default. Metadata access uses an explicit metadata selector in structured APIs, not accidental collisions with user fields. Built-in text variants share primitives but keep dedicated descriptions, examples, and evaluators.

## 7. Administrative API

| Surface | Required operations |
| --- | --- |
| setup | Detect configured/reachable local provider; show suggested model/download size; downloads require explicit user action; never silently choose a remote endpoint |
| doctor | Check configuration, route reachability on request, model availability, capabilities, extension health, picker dependency |
| providers | list, add, remove; native Ollama or OpenAI-compatible; named endpoint and optional apiKeyEnv |
| models | list --provider NAME; no ambiguous numeric selection persistence |
| profiles | list, show, set, remove; provider + model + inference defaults |
| route | inspect COMMAND --json; show resolution sources without secrets; no inference |
| commands | list, describe, validate; built-ins and named definitions |
| types | list, describe; schema and CLI bindings from generated manifests |
| extensions | scaffold, check, test, add, remove, list; local paths in v1 |
| run | Invoke a named YAML command definition; --args-json or generated flags |
| flow | run, validate, plan; saved linear YAML flow and inline `flow --file X summarize :: rewrite "..."` |
| init | Create project configuration and opt-in agent guidance for codex/claude/cursor/opencode without overwriting existing guidance |
| completions | bash, zsh, fish generation; no inference or extension execution |

Machine outputs include schemaVersion. No interactive prompt in non-TTY mode; provide corrective command instructions instead.

## 8. Data and shell contract (R-DATA)

Input modes: `auto`, `text`, `lines`, `jsonl`, `records`. `auto` recognizes only the exact versioned Ribbit wire header; otherwise it buffers bounded input as text. It does not guess whether arbitrary text is JSON. External JSONL and lines require their explicit mode. Ribbit record-producing commands emit the wire format by default, even in a terminal; users use render for friendly tables. Text commands emit plain text. Tree is explicitly a display command and defaults to rendered text. Internal flows bypass serialization.

Wire format: first line `{"$ribbit":{"version":1,"kind":"records"}}`; subsequent lines are objects with `id`, `value`, optional `source`, and `annotations`. A header may not carry application data. Invalid versions or malformed records fail. A coincidental header can be treated literally with --input text. --output jsonl emits bare values for interoperability, intentionally dropping metadata; --output records preserves it. Structured extraction emits one JSON value by default and supports records output explicitly.

Record IDs are unique and stable within one input run; transformations retain lineage but do not promise global identity across runs. Source may include path and line range only when known. Do not invent citation offsets. External record adapters assign IDs in input order. Annotations are namespaced by command or flow step. Filter/pick preserve original records, rank changes order only, classify adds annotations, map changes value and retains origin. Group produces group records containing originals. Reduce/extract output has run-level source lineage where available.

Stdin and --file cannot both supply data; compare exclusively owns its two files. --file accepts one text source; read handles multiple. Empty record streams produce empty record streams for record operations and no inference. Text generation commands reject empty evidence unless ask has a self-contained instruction. Global operations inspect bounded input before inference. Output is UTF-8; malformed input is rejected with location. A final unterminated line is accepted.

Stdout contains only result data. Errors, statistics and progress use stderr. --json on management commands controls their response object; execution data uses --output to avoid ambiguity. --error-format json controls machine diagnostics. Exit codes: 0 success (including zero matches), 2 usage/schema input error, 3 config/provider/capability error, 4 inference/output validation failure, 5 extension execution failure, 6 budget/size limit, 7 filesystem/backend I/O failure, 130 cancellation. Expected downstream pipe closure is successful early termination; other broken writes are errors. Partial streaming output may exist on nonzero exit; records are emitted only after each is valid. Scripts needing full-pipeline success should use shell pipefail.

## 9. Extension authoring contract (R-EXT)

Command types are TypeScript modules built with a supported pinned Zod major and SDK. `defineCommand` declares type (scoped ID), semantic version, description, config schema, and actions. Each action declares description, args schema, input/output schemas, execution mode (value or records), inference capabilities, effects metadata, and execute function. execute receives `{input,args,config}` plus context. Config and args are separate; unknown keys fail. Defaults apply before validation. Built-ins use this same contract.

Public schemas use a JSON-compatible subset: strings, finite numbers, booleans, null, arrays, strict objects, enums, optional/default properties and supported unions. Arbitrary transforms, functions, cycles, custom refinements and non-JSON values are rejected by manifest export unless represented as separately documented runtime checks. Output is validated after execute, including any postprocessing after ctx.llm.object.

CLI generation maps camelCase fields to kebab-case flags; scalar arrays accept repeated flags; complex objects use --args-json. Positional mapping is explicit metadata; no inference of positions. Reserved runtime flag collisions fail extension check. --args-json and field flags cannot both set the same field. A registry-produced manifest drives help, completion, schema discovery, YAML validation and planner inspection without importing extension code. Loading TS to generate that manifest occurs only during explicit check/add/build, because imports can have side effects.

Runtime context includes llm.text, llm.object, log, signal and a shared budget. Text streaming uses an explicit async-iterable execution mode; structured records are validated before emission. llm.object requests native schema support when available and always validates locally. One explicit schema-repair attempt is the default maximum; no silent retry loop. Transport retries are bounded and counted. Validation repair is not a factual correctness guarantee.

Executable extensions are explicitly installed trusted code, with filesystem/network/process effects possible. Effects metadata is descriptive, not enforcement. Project-local files are never executed merely because the user enters a repository or runs help. Builds capture dependency versions, source hash and SDK compatibility. No remote imports/downloads during normal execution. Changed local sources require explicit rebuild/add and invalidate cached manifests. Extension removal cannot delete unrelated user files. An extension invoking its own provider client is outside managed routing guarantees and must disclose that behavior; built-ins must use ctx.llm.

## 10. YAML definitions and flows (R-FLOW)

Command definition fields: apiVersion ribbit/v1, kind Command, name, type, typeVersion (exact), action, config, defaults (action args), inference. Resolve only installed types. Duplicate names fail rather than shadow built-ins. Runtime flags may override invocation args; config remains definition-owned. Project definitions can override global definitions only through explicit documented namespacing, not silent precedence.

Example definition:

```yaml
apiVersion: ribbit/v1
kind: Command
name: commit
type: '@local/commit-message'
typeVersion: '1.0.0'
action: run
config:
  style: conventional
defaults:
  scope: cli
inference:
  profile: local-fast
```

Flow fields: apiVersion, kind Flow, name, input JSON Schema, inference default, steps, output. Each step has unique id, command, args, input binding, optional inference. References are objects `{$ref: input}` or `{$ref: steps.ID.output[.field]}`; object keys/array indices use a documented restricted path syntax. No CEL, JavaScript, arithmetic, implicit string interpolation, future references, nested flows, or cycles in v1. Values preserve types. Unknown fields/paths fail. Obvious schema mismatches fail preflight; runtime validation remains authoritative. Repeated --rule is an additive instruction within a single inference action; arbitrary steps are never automatically fused.

Inline flows use literal `::` tokens, with command segment arguments parsed independently. Top-level input and budget options precede the first segment. Each segment uses the same command parser; quoted `::` inside a prompt remains part of that argument, while a standalone separator is reserved. Flow plan performs no inference and displays routes, input bindings, streaming/barrier boundaries, limits and declared effects. It is not a prediction of LLM-generated output or arbitrary TS behavior.

## 11. Provider/model routing (R-ROUTE)

Two initial adapters: native Ollama and OpenAI-compatible HTTP. Named providers configure type, base URL, optional default model and apiKeyEnv. Profiles configure provider/model and inference parameters. OpenAI-compatible is a tested protocol subset, not a claim every vendor works. Target conformance: native local Ollama, LM Studio compatible endpoint, and one hosted compatible test endpoint with credentials supplied by the tester. Custom base URLs are supported; native Anthropic/Gemini adapters are deferred.

Every semantic command and extension action receives --profile, --provider, --model. Profiles support temperature, maximum output tokens, timeout and reasoning control only when the selected adapter/model supports them; unsupported settings fail clearly. Structured schema-constrained requests default reasoning off where the provider declares the capability; free text keeps the model default. Credentials never appear in YAML definitions, diagnostics or manifests. Local-first means default setup selects a loopback provider; a local-looking proxy cannot establish that downstream inference stays local. No remote fallback on error. Provider selection in a project must be explicit and inspectable; no hidden provider selection based on content.

Resolution from strongest to weakest: explicit command/step CLI flags; flow step inference; named definition inference; user per-command routing; invocation flow default; saved flow default; global default. A layer with a profile selects a complete base profile and does not inherit a lower layer's provider/model tuple. Explicit fields within that same layer override the profile. A layer containing only model retains the lower resolved provider. A provider-only change resets model to that provider's configured default or errors if absent; it never carries an incompatible lower provider model. Non-route settings follow the same layering but retain compatible lower defaults unless explicitly reset. Capability checks run after route resolution. Unknown models do not auto-download.

For named commands, per-command rules match the definition name first, then its scoped type/action, then global defaults. Built-ins match canonical command name. A flow's --profile/--provider/--model supplies its invocation default; segment flags still win. --force-profile explicitly replaces all managed inference routes in the flow, including segment/definition overrides; incompatible capability requirements then fail preflight. Force changes routing only, not action arguments. Text prompts cannot change any route. Route inspect reports chosen provider/model and the source layer for each value, redacting secrets.

## 12. Filesystem and interactive behavior (R-FS)

Root traversal observes .gitignore and Ribbit ignore rules by default; hidden files excluded unless --hidden, ignored files included only with --no-ignore. Default sensitive-name exclusions cover .env variants, credential key files and VCS internal content for semantic reads; explicit inclusion is required and visible in the plan. This is a convenience filter, not proof of secret detection. Explicit read paths are intentional inputs and do not get silently dropped. Symlink directories are not traversed by default; --follow detects cycles and retains the requested root boundary unless --outside-root is explicit. Binary files are skipped in discovery content reads with a diagnostic; explicit read of binary input errors.

ls/find emit actual metadata. find first applies cheap exact predicates, then semantic decisions on names unless --read content is explicit. tree --describe defaults to names evidence, labels descriptions accordingly, and supports --read content for richer evidence. Budgets: configurable maximum files and input bytes; omit nothing silently. Discovery budget exhaustion errors before semantic inference. No model output may introduce a path not present in candidates. Traversal errors are reported; --on-read-error skip is an explicit discovery-only option producing warnings and omission counts.

pick v1 uses an installed fzf-compatible backend with a pinned supported minimum determined in the runtime spike. Invocation passes argv without shell interpolation. Opaque IDs map display labels back to originals; tabs, newlines, ANSI sequences and hostile labels cannot inject arguments or corrupt identity. --about performs a bounded semantic rank once, then the picker operates lexically. Cancel returns 130 and no selections. A TTY is required; absent backend returns an actionable error. Backend output is never trusted to create arbitrary records.

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

## 16. Decisions and source notes

Established decisions: local-first; 22-command scope; TypeScript + Zod authoring; YAML configured commands; typed linear flows; two provider adapters; command-level overrides; no inference for exact tools; executable extensions are in v1; stealth publication boundary.

Still to resolve through delivery gates: concrete runtime/distribution, default model/quantization and reference hardware, fzf supported minimum, name availability verification, and final platform performance numbers. None changes the public product goals without an explicit scope revision.

References reviewed in the conversation:

- [ai-coreutils README](https://github.com/richstokoe/ai-coreutils/blob/main/README.md): initial inspiration for small LLM-backed shell utilities.
- [Swamp overview](https://swamp-club.com/manual/explanation/how-swamp-works), [extension interface](https://swamp-club.com/manual/reference/extensions/model), [definitions](https://swamp-club.com/manual/reference/model-definitions): inspiration for separating executable types, schemas, and YAML instances. Ribbit's API in this document is an original proposal.
- [Stet reference commit](https://github.com/funsaized/stet/commit/7279869d68c09829de08b36cd74633e9dd63c0db): delivery structure inspiration—contract files, dependency index, bounded task files, review evidence. Inspected using the GitHub commit API when the supplied PR changes URL did not load.

This plan adopts architectural patterns rather than copying upstream implementation. Any future source reuse requires its own provenance/license decision.
