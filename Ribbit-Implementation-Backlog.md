# Ribbit — Full implementation backlog

Private planning draft · 2026-09-13

Standalone reading copy. Relative links refer to the matching paths in the companion ZIP; every task and contract is also included below.


---

# Ribbit delivery plan

Private planning draft, 2026-09-13. This package adapts the structure of the [Stet reference commit](https://github.com/funsaized/stet/commit/7279869d68c09829de08b36cd74633e9dd63c0db): a dependency index, separate contracts, bounded task assignments and acceptance evidence. All task content is specific to Ribbit.

## Authority and execution

The user's current instructions take precedence. The PRD defines product scope; ratified contracts define behavior; backlog defines dependencies; task files define bounded implementation work. Contracts begin PROPOSED, not approved. Resolve contradictions by recording a decision and updating affected files. Do not silently change product scope.

States: BLOCKED → READY → IN_PROGRESS → REVIEW → ACCEPTED. A task becomes READY only when direct dependencies are ACCEPTED and its relevant contracts are ratified. A worker returns REVIEW with evidence; a designated reviewer/integrator marks ACCEPTED. Required human evidence needs actual owner-arranged participation. Post-release tasks remain inactive until separately selected.

Only BASE-01 is initially READY. Execute BASE-01 then DECIDE-01. Contract tracks 01/02/03/05 can be prepared independently after the runtime decision; CONTRACT-04 follows the first three. This plan permits future scheduling but does not instruct the current assistant to spawn agents or implement code. Parallel writers, if authorized, must own disjoint files; package metadata, lockfiles, SDK contracts and registry generators have one writer at a time.

## Task rules

Read task, parent PRD sections, relevant contracts and existing callers before editing. Paths are proposed for a greenfield repository; BASE-01 maps existing paths. Do not recreate an existing architecture solely to match names here. Keep changes inside listed scope; a necessary adjacent change requires a task amendment, not an unrelated refactor. Never weaken fixtures or alter budgets to make failures disappear. Add focused regression checks for material behavior. Stop when a contract is contradictory, a dependency is unaccepted, a gate fails without a scoped remedy, or permissions/credentials are unavailable. Record the blocker and the smallest next action. Do not invent test success.

No publication, outreach, public registry submission or account creation is included. Local reversible implementation and validation belong to implementation tasks when the owner starts that work. Publication remains separate from release-ready acceptance. Do not copy upstream code without a provenance/license decision.

## Verification interface

BUILD-01 must create and document equivalents of: check (types/lint), test:unit, test:consumer, test:cli, test:conformance, test:docs, build, bench, eval:semantic, eval:agent, package:smoke. These are planned script names, not claims they exist today. Tasks use the narrowest relevant subset; acceptance records exact commands from the chosen runtime. Missing provider credentials/platform hardware means unverified, never passed. Live evals are opt-in and count all requests/repairs.

## Completion

Each task writes docs/delivery/evidence/ID.md. Index status is authoritative; individual file initial states are synchronized when work starts. RELEASE-01 additionally checks every required task, not just its listed direct gate predecessors. RELEASE-02 prepares a private decision packet; it does not publish.


---

# Executable implementation backlog

Version 1.0 · Private planning draft · All work unstarted

Read [execution rules](README.md), [PRD](../PRD.md), and [contracts](contracts/cli-data.md). Sizes are intentionally not time estimates; each task is a bounded deliverable and may be split before dispatch without weakening acceptance.

| ID | Assignment | Class | Parent | Direct dependencies | State |
| --- | --- | --- | --- | --- | --- |
| [BASE-01](tasks/BASE-01.md) | Establish repository and delivery baseline | Required | G1–G8 | — | READY |
| [DECIDE-01](tasks/DECIDE-01.md) | Prove the runtime and distribution path | Required gate | G2/G7; R-EXT/R-PERF | BASE-01 | BLOCKED |
| [CONTRACT-01](tasks/CONTRACT-01.md) | Freeze command and data contracts | Required gate | G1/G5; R-DATA | DECIDE-01 | BLOCKED |
| [CONTRACT-02](tasks/CONTRACT-02.md) | Freeze SDK, build and extension trust contracts | Required gate | G2/G6; R-EXT | DECIDE-01 | BLOCKED |
| [CONTRACT-03](tasks/CONTRACT-03.md) | Freeze routing and provider conformance | Required gate | G4; R-ROUTE | DECIDE-01 | BLOCKED |
| [CONTRACT-04](tasks/CONTRACT-04.md) | Freeze linear flow and filesystem contracts | Required gate | G3/G5; R-FLOW/R-FS | CONTRACT-01, CONTRACT-02, CONTRACT-03 | BLOCKED |
| [CONTRACT-05](tasks/CONTRACT-05.md) | Ratify measurable release gates | Required gate | G7/G8; R-PERF | DECIDE-01 | BLOCKED |
| [BUILD-01](tasks/BUILD-01.md) | Create workspace, scripts and CI skeleton | Required | G2/G7 | CONTRACT-01, CONTRACT-02 | BLOCKED |
| [CORE-01](tasks/CORE-01.md) | Implement record adapters and wire format | Required | R-DATA | BUILD-01 | BLOCKED |
| [CORE-02](tasks/CORE-02.md) | Implement execution lifecycle and budgets | Required | R-DATA/R-PERF | CORE-01 | BLOCKED |
| [SDK-01](tasks/SDK-01.md) | Implement typed command SDK | Required | R-EXT | BUILD-01 | BLOCKED |
| [SDK-02](tasks/SDK-02.md) | Generate manifests and CLI schema bindings | Required | R-EXT/G6 | SDK-01 | BLOCKED |
| [EXT-01](tasks/EXT-01.md) | Build and explicitly install local extensions | Required | R-EXT | SDK-02, CORE-02 | BLOCKED |
| [EXT-02](tasks/EXT-02.md) | Execute extension actions through shared engine | Required | G2/R-EXT | EXT-01, SDK-01, CORE-02 | BLOCKED |
| [CLI-01](tasks/CLI-01.md) | Implement parser and shell behavior | Required | G1/G5 | SDK-02, CORE-02 | BLOCKED |
| [CLI-02](tasks/CLI-02.md) | Implement catalog, discovery and completion | Required | G6 | CLI-01, EXT-01 | BLOCKED |
| [ROUTE-01](tasks/ROUTE-01.md) | Implement configuration and route resolver | Required | G4/R-ROUTE | BUILD-01, CONTRACT-03 | BLOCKED |
| [ROUTE-02](tasks/ROUTE-02.md) | Implement provider/profile management and inspection | Required | G4/G6 | ROUTE-01, CLI-01 | BLOCKED |
| [PROV-01](tasks/PROV-01.md) | Implement managed inference interface | Required | G4/R-EXT | ROUTE-01, SDK-01, CORE-02 | BLOCKED |
| [PROV-02](tasks/PROV-02.md) | Implement native Ollama adapter | Required | G4 | PROV-01 | BLOCKED |
| [PROV-03](tasks/PROV-03.md) | Implement OpenAI-compatible adapter | Required | G4 | PROV-01 | BLOCKED |
| [PROV-04](tasks/PROV-04.md) | Implement setup, doctor and model discovery | Required | G4/G8 | PROV-02, PROV-03, ROUTE-02, CLI-02 | BLOCKED |
| [CMD-01](tasks/CMD-01.md) | Ship ask, summarize, explain and rewrite | Required | C01–C04 | EXT-02, CLI-01, PROV-01 | BLOCKED |
| [CMD-02](tasks/CMD-02.md) | Ship extract and classify | Required | C05–C06 | EXT-02, CLI-01, PROV-01 | BLOCKED |
| [CMD-03](tasks/CMD-03.md) | Ship filter and map | Required | C07/C10 | EXT-02, CLI-01, PROV-01 | BLOCKED |
| [CMD-04](tasks/CMD-04.md) | Ship rank and group | Required | C08–C09 | EXT-02, CLI-01, PROV-01 | BLOCKED |
| [CMD-05](tasks/CMD-05.md) | Ship reduce and compare | Required | C11–C12 | EXT-02, CLI-01, PROV-01 | BLOCKED |
| [CMD-06](tasks/CMD-06.md) | Ship deterministic projection and sequence helpers | Required | C18–C21 | EXT-02, CLI-01 | BLOCKED |
| [CMD-07](tasks/CMD-07.md) | Ship render and safe templates | Required | C22 | EXT-02, CLI-01, CONTRACT-04 | BLOCKED |
| [FS-01](tasks/FS-01.md) | Implement traversal and text readers | Required | R-FS | CORE-01, CORE-02, CONTRACT-04 | BLOCKED |
| [FS-02](tasks/FS-02.md) | Ship ls and read | Required | C13/C17 | FS-01, EXT-02, CLI-01 | BLOCKED |
| [FS-03](tasks/FS-03.md) | Ship semantic find | Required | C14 | FS-02, CMD-03 | BLOCKED |
| [FS-04](tasks/FS-04.md) | Ship tree with semantic annotations | Required | C15 | FS-02, CMD-01, CMD-03 | BLOCKED |
| [FS-05](tasks/FS-05.md) | Ship interactive pick with backend integration | Required | C16 | FS-02, CMD-04 | BLOCKED |
| [FLOW-01](tasks/FLOW-01.md) | Implement YAML definitions and resolution | Required | G3/R-FLOW | SDK-02, ROUTE-01, CLI-02 | BLOCKED |
| [FLOW-02](tasks/FLOW-02.md) | Implement typed linear flow planner | Required | G3/R-FLOW | FLOW-01, CONTRACT-04 | BLOCKED |
| [FLOW-03](tasks/FLOW-03.md) | Execute flows with shared runtime and limits | Required | G3/G4 | FLOW-02, EXT-02, PROV-01 | BLOCKED |
| [AGENT-01](tasks/AGENT-01.md) | Implement scaffolding and fixture runner | Required | G6 | EXT-01, SDK-02 | BLOCKED |
| [AGENT-02](tasks/AGENT-02.md) | Ship agent guidance initialization | Required | G6 | AGENT-01, CLI-02, FLOW-02 | BLOCKED |
| [AGENT-03](tasks/AGENT-03.md) | Run independent agent consumer evaluation | Required gate | G6/R-PERF | AGENT-02, FLOW-03, CMD-01, CMD-02 | BLOCKED |
| [QA-01](tasks/QA-01.md) | Build adversarial conformance suite | Required | G5/G8 | FLOW-03, FS-05, CMD-07 | BLOCKED |
| [EVAL-01](tasks/EVAL-01.md) | Create labeled semantic datasets and rubrics | Required | G7 | CONTRACT-05 | BLOCKED |
| [EVAL-02](tasks/EVAL-02.md) | Select default small local model and evaluate commands | Required gate | G7 | EVAL-01, PROV-02, PROV-03, CMD-01, CMD-02, CMD-03, CMD-04, CMD-05, FS-03, FS-04 | BLOCKED |
| [PERF-01](tasks/PERF-01.md) | Measure and optimize runtime overhead | Required gate | G7 | CONTRACT-05, FLOW-03, FS-05, CMD-06, CMD-07 | BLOCKED |
| [SHIP-01](tasks/SHIP-01.md) | Package installable artifacts for target platforms | Required | G8 | QA-01, PERF-01 | BLOCKED |
| [DOCS-01](tasks/DOCS-01.md) | Write complete command, SDK and routing docs | Required | G1/G6 | FLOW-03, FS-05, AGENT-02 | BLOCKED |
| [DOCS-02](tasks/DOCS-02.md) | Verify docs against packaged CLI | Required | G1/G8 | DOCS-01, SHIP-01 | BLOCKED |
| [PILOT-01](tasks/PILOT-01.md) | Validate first-run and recurring use cases with owner-selected users | Required human evidence | G8/R-PERF | DOCS-02, EVAL-02 | BLOCKED |
| [RELEASE-01](tasks/RELEASE-01.md) | Audit complete initial scope and release evidence | Required gate | G1–G8 | AGENT-03, EVAL-02, PERF-01, DOCS-02, PILOT-01 | BLOCKED |
| [RELEASE-02](tasks/RELEASE-02.md) | Prepare private launch decision packet | Required gate | G8 | RELEASE-01 | BLOCKED |
| [FOLLOW-01](tasks/FOLLOW-01.md) | Explore additional native providers | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-02](tasks/FOLLOW-02.md) | Explore branching flows and nested invocation | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-03](tasks/FOLLOW-03.md) | Explore sandboxed extension distribution | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-04](tasks/FOLLOW-04.md) | Explore filesystem mutations and plan/apply | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-05](tasks/FOLLOW-05.md) | Explore wider platforms, ingestion and indexing | Post-release | Deferred | RELEASE-02 | BLOCKED |

## Milestones and dispatch

1. Foundation: BASE-01, DECIDE-01, CONTRACT-01 through CONTRACT-05, BUILD-01.
2. Usable engine: CORE/SDK/EXT/CLI/ROUTE/PROV tracks; a typed external command runs through a local provider.
3. Complete command set: CMD and FS tracks; all 22 public commands work through the shared contract.
4. Composition and agents: FLOW/AGENT tracks; named definitions and mixed-route flows pass consumer tests.
5. Release evidence: QA/EVAL/PERF/SHIP/DOCS/PILOT; all thresholds measured, none assumed.
6. Private release-ready audit and owner decision packet: RELEASE-01/02.

Runtime/schema work is the critical path. EVAL-01 can prepare datasets while runtime implementation proceeds. Filesystem and provider adapter tasks can be scheduled independently once their dependencies are accepted. This is an execution dependency plan, not a request to launch parallel agents now.

## Scope control

All Required, Required gate and Required human evidence tasks block full v1 acceptance. FOLLOW tasks are explicitly excluded. No estimated calendar date is committed: runtime feasibility, model evaluation and real-user scheduling are not yet measured. After BASE/DECIDE acceptance, size tasks against actual repository context and sequence within team capacity.


---

# Requirements traceability

All commands also require DOCS-01/02 and RELEASE-01 coverage.

| Requirement | Implementation / evidence tasks |
| --- | --- |
| C01 | CMD-01 |
| C02 | CMD-01 |
| C03 | CMD-01 |
| C04 | CMD-01 |
| C05 | CMD-02 |
| C06 | CMD-02 |
| C07 | CMD-03 |
| C08 | CMD-04 |
| C09 | CMD-04 |
| C10 | CMD-03 |
| C11 | CMD-05 |
| C12 | CMD-05 |
| C13 | FS-02 |
| C14 | FS-03 |
| C15 | FS-04 |
| C16 | FS-05 |
| C17 | FS-02 |
| C18 | CMD-06 |
| C19 | CMD-06 |
| C20 | CMD-06 |
| C21 | CMD-06 |
| C22 | CMD-07 |
| R-DATA | CONTRACT-01, CORE-01, CORE-02, CLI-01, QA-01 |
| R-EXT | CONTRACT-02, SDK-01, SDK-02, EXT-01, EXT-02, AGENT-01 |
| R-ROUTE | CONTRACT-03, ROUTE-01, ROUTE-02, PROV-01, PROV-02, PROV-03, PROV-04 |
| R-FLOW | CONTRACT-04, FLOW-01, FLOW-02, FLOW-03 |
| R-FS | CONTRACT-04, FS-01, FS-02, FS-03, FS-04, FS-05 |
| R-PERF | CONTRACT-05, EVAL-01, EVAL-02, PERF-01, AGENT-03, PILOT-01 |


---

# Cli Data contract

Status: PROPOSED for implementation planning. The corresponding CONTRACT task must ratify this baseline with evidence; this document does not imply user approval of unpublished details.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

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



---

# Extensions contract

Status: PROPOSED for implementation planning. The corresponding CONTRACT task must ratify this baseline with evidence; this document does not imply user approval of unpublished details.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

## 9. Extension authoring contract (R-EXT)

Command types are TypeScript modules built with a supported pinned Zod major and SDK. `defineCommand` declares type (scoped ID), semantic version, description, config schema, and actions. Each action declares description, args schema, input/output schemas, execution mode (value or records), inference capabilities, effects metadata, and execute function. execute receives `{input,args,config}` plus context. Config and args are separate; unknown keys fail. Defaults apply before validation. Built-ins use this same contract.

Public schemas use a JSON-compatible subset: strings, finite numbers, booleans, null, arrays, strict objects, enums, optional/default properties and supported unions. Arbitrary transforms, functions, cycles, custom refinements and non-JSON values are rejected by manifest export unless represented as separately documented runtime checks. Output is validated after execute, including any postprocessing after ctx.llm.object.

CLI generation maps camelCase fields to kebab-case flags; scalar arrays accept repeated flags; complex objects use --args-json. Positional mapping is explicit metadata; no inference of positions. Reserved runtime flag collisions fail extension check. --args-json and field flags cannot both set the same field. A registry-produced manifest drives help, completion, schema discovery, YAML validation and planner inspection without importing extension code. Loading TS to generate that manifest occurs only during explicit check/add/build, because imports can have side effects.

Runtime context includes llm.text, llm.object, log, signal and a shared budget. Text streaming uses an explicit async-iterable execution mode; structured records are validated before emission. llm.object requests native schema support when available and always validates locally. One explicit schema-repair attempt is the default maximum; no silent retry loop. Transport retries are bounded and counted. Validation repair is not a factual correctness guarantee.

Executable extensions are explicitly installed trusted code, with filesystem/network/process effects possible. Effects metadata is descriptive, not enforcement. Project-local files are never executed merely because the user enters a repository or runs help. Builds capture dependency versions, source hash and SDK compatibility. No remote imports/downloads during normal execution. Changed local sources require explicit rebuild/add and invalidate cached manifests. Extension removal cannot delete unrelated user files. An extension invoking its own provider client is outside managed routing guarantees and must disclose that behavior; built-ins must use ctx.llm.



---

# Flows Filesystem contract

Status: PROPOSED for implementation planning. The corresponding CONTRACT task must ratify this baseline with evidence; this document does not imply user approval of unpublished details.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

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


## 12. Filesystem and interactive behavior (R-FS)

Root traversal observes .gitignore and Ribbit ignore rules by default; hidden files excluded unless --hidden, ignored files included only with --no-ignore. Default sensitive-name exclusions cover .env variants, credential key files and VCS internal content for semantic reads; explicit inclusion is required and visible in the plan. This is a convenience filter, not proof of secret detection. Explicit read paths are intentional inputs and do not get silently dropped. Symlink directories are not traversed by default; --follow detects cycles and retains the requested root boundary unless --outside-root is explicit. Binary files are skipped in discovery content reads with a diagnostic; explicit read of binary input errors.

ls/find emit actual metadata. find first applies cheap exact predicates, then semantic decisions on names unless --read content is explicit. tree --describe defaults to names evidence, labels descriptions accordingly, and supports --read content for richer evidence. Budgets: configurable maximum files and input bytes; omit nothing silently. Discovery budget exhaustion errors before semantic inference. No model output may introduce a path not present in candidates. Traversal errors are reported; --on-read-error skip is an explicit discovery-only option producing warnings and omission counts.

pick v1 uses an installed fzf-compatible backend with a pinned supported minimum determined in the runtime spike. Invocation passes argv without shell interpolation. Opaque IDs map display labels back to originals; tabs, newlines, ANSI sequences and hostile labels cannot inject arguments or corrupt identity. --about performs a bounded semantic rank once, then the picker operates lexically. Cancel returns 130 and no selections. A TTY is required; absent backend returns an actionable error. Backend output is never trusted to create arbitrary records.



---

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



---

# Routing contract

Status: PROPOSED for implementation planning. The corresponding CONTRACT task must ratify this baseline with evidence; this document does not imply user approval of unpublished details.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

## 11. Provider/model routing (R-ROUTE)

Two initial adapters: native Ollama and OpenAI-compatible HTTP. Named providers configure type, base URL, optional default model and apiKeyEnv. Profiles configure provider/model and inference parameters. OpenAI-compatible is a tested protocol subset, not a claim every vendor works. Target conformance: native local Ollama, LM Studio compatible endpoint, and one hosted compatible test endpoint with credentials supplied by the tester. Custom base URLs are supported; native Anthropic/Gemini adapters are deferred.

Every semantic command and extension action receives --profile, --provider, --model. Profiles support temperature, maximum output tokens and timeout only when the selected adapter/model supports them; unsupported settings fail clearly. Credentials never appear in YAML definitions, diagnostics or manifests. Local-first means default setup selects a loopback provider; a local-looking proxy cannot establish that downstream inference stays local. No remote fallback on error. Provider selection in a project must be explicit and inspectable; no hidden provider selection based on content.

Resolution from strongest to weakest: explicit command/step CLI flags; flow step inference; named definition inference; user per-command routing; invocation flow default; saved flow default; global default. A layer with a profile selects a complete base profile and does not inherit a lower layer's provider/model tuple. Explicit fields within that same layer override the profile. A layer containing only model retains the lower resolved provider. A provider-only change resets model to that provider's configured default or errors if absent; it never carries an incompatible lower provider model. Non-route settings follow the same layering but retain compatible lower defaults unless explicitly reset. Capability checks run after route resolution. Unknown models do not auto-download.

For named commands, per-command rules match the definition name first, then its scoped type/action, then global defaults. Built-ins match canonical command name. A flow's --profile/--provider/--model supplies its invocation default; segment flags still win. --force-profile explicitly replaces all managed inference routes in the flow, including segment/definition overrides; incompatible capability requirements then fail preflight. Force changes routing only, not action arguments. Text prompts cannot change any route. Route inspect reports chosen provider/model and the source layer for each value, redacting secrets.



---

# Evidence requirements

No implementation or check is represented as completed in this planning package.

For each task record: task ID; exact revision and dirty state; environment and runtime; changed files; each acceptance criterion with PASS/FAIL/UNVERIFIED and supporting artifact; exact commands and exit status; measurements including sample counts; first-attempt failures and corrections; pre-existing failures; unverified items and reason; remaining risks; reviewer decision/date.

For semantic tasks include provider/model/digest if available, quantization, hardware, dataset revision, request/repair counts, rubric scores and cold/warm latency. For agent tasks include prompts, public context supplied, assistance, outcome and failures. For human pilots preserve consent and anonymity; synthetic runs are not human evidence.

Keep large raw logs outside ordinary source control and link retained artifacts. Do not include credentials, content-bearing tokens or private user data. A missing platform or absent API key blocks that gate; it is not evidence of a pass. Any gate revision records rationale before rerunning measurements.


---

# BASE-01 — Establish repository and delivery baseline

## Outcome

Record whether the implementation repository exists, its revision and dirty state, existing commands, environment, platform and tool availability. Map proposed paths to existing equivalents before coding. Record missing tools without installing them as part of this task.

## Parent and state

Parent: G1–G8. Class: Required. Initial state: **READY**. Current state is maintained in backlog.md.

## Prerequisites

None; this is the first assignment.

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/evidence/BASE-01.md; repository inventory only. Task-specific evidence under docs/delivery/evidence/BASE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Record whether the implementation repository exists, its revision and dirty state, existing commands, environment, platform and tool availability. Map proposed paths to existing equivalents before coding. Record missing tools without installing them as part of this task.

## Acceptance criteria

- A reviewer can distinguish pre-existing failures from introduced failures.
- Absent repository is explicitly greenfield, not inferred to contain code.
- Planning files are preserved.

## Verification

Read-only repository/environment inspection; record exact commands and statuses. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# DECIDE-01 — Prove the runtime and distribution path

## Outcome

Compare at least two practical TS-capable execution/distribution options using a tiny typed extension, cached manifest lookup, streaming and cancellation. Include an installed binary prototype on both target platforms. Measure process startup separately from inference and justify one runtime.

## Parent and state

Parent: G2/G7; R-EXT/R-PERF. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BASE-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

spikes/runtime/; docs/decisions/runtime.md; evidence. Task-specific evidence under docs/delivery/evidence/DECIDE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Compare at least two practical TS-capable execution/distribution options using a tiny typed extension, cached manifest lookup, streaming and cancellation. Include an installed binary prototype on both target platforms. Measure process startup separately from inference and justify one runtime.

## Acceptance criteria

- Chosen runtime loads installed extensions without network.
- Schema discovery executes no extension code.
- Packaging supports macOS arm64/Linux x86_64.
- Latency/RSS and maintenance tradeoffs are recorded.
- Target changes require a documented decision.

## Verification

Repeated cold/warm startup measurements; executable extension fixture; no-network run; platform smoke evidence. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CONTRACT-01 — Freeze command and data contracts

## Outcome

Ratify wire header, command arguments, exit codes, records, field selectors, stdin/file ambiguity, empty inputs and serialization. Add normative successful and failing fixtures.

## Parent and state

Parent: G1/G5; R-DATA. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/cli-data.md; fixtures/contracts/. Task-specific evidence under docs/delivery/evidence/CONTRACT-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Ratify wire header, command arguments, exit codes, records, field selectors, stdin/file ambiguity, empty inputs and serialization. Add normative successful and failing fixtures.

## Acceptance criteria

- All 22 commands have unambiguous input/output modes.
- Wire auto-detection cannot silently reinterpret ordinary JSON.
- Partial output and early pipe closure are specified.

## Verification

Review fixture matrix against PRD C01–C22; parse all JSON fixtures. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CONTRACT-02 — Freeze SDK, build and extension trust contracts

## Outcome

Define SDK signatures, streaming mode, schema subset, generated manifest format, dependency locks and trust activation. Choose supported TS/Zod versions based on the spike and freeze a test consumer.

## Parent and state

Parent: G2/G6; R-EXT. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/extensions.md; fixtures/contracts/. Task-specific evidence under docs/delivery/evidence/CONTRACT-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Define SDK signatures, streaming mode, schema subset, generated manifest format, dependency locks and trust activation. Choose supported TS/Zod versions based on the spike and freeze a test consumer.

## Acceptance criteria

- No separate hidden built-in API.
- Help reads a manifest.
- Imports only execute during explicit build/install or run.
- Unsupported Zod features fail precisely.

## Verification

Compile representative extension consumer; validate manifest fixtures; adversarial import fixture. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CONTRACT-03 — Freeze routing and provider conformance

## Outcome

Translate the PRD precedence into a table-driven resolver specification including provider-only reset, model-only override, profile replacement, flow defaults and force-profile. Define supported HTTP payload subset and secret redaction.

## Parent and state

Parent: G4; R-ROUTE. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/routing.md; fixtures/routes/. Task-specific evidence under docs/delivery/evidence/CONTRACT-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Translate the PRD precedence into a table-driven resolver specification including provider-only reset, model-only override, profile replacement, flow defaults and force-profile. Define supported HTTP payload subset and secret redaction.

## Acceptance criteria

- Every precedence pair has expected resolved fields and provenance.
- Provider change cannot retain foreign model accidentally.
- No endpoint contacted by route inspection.

## Verification

Review route table; serialize fixture inputs and expected outputs. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CONTRACT-04 — Freeze linear flow and filesystem contracts

## Outcome

Specify reference path grammar, inline segment parsing, barriers, route inheritance, ignores, symlinks, evidence reads, picker transport and unknown schemas. Define template syntax without eval.

## Parent and state

Parent: G3/G5; R-FLOW/R-FS. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-01; Accepted CONTRACT-02; Accepted CONTRACT-03

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/flows-filesystem.md; fixtures/flows/. Task-specific evidence under docs/delivery/evidence/CONTRACT-04.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Specify reference path grammar, inline segment parsing, barriers, route inheritance, ignores, symlinks, evidence reads, picker transport and unknown schemas. Define template syntax without eval.

## Acceptance criteria

- References address prior steps only.
- Invalid paths fail.
- Filenames are never generated.
- Model reads are explicit.
- Fzf mapping preserves hostile labels safely.

## Verification

Review positive/negative flow YAML and filesystem scenario matrix. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CONTRACT-05 — Ratify measurable release gates

## Outcome

Name reference hardware/OS, measurement methodology, quality rubrics and dataset ownership. Ratify numeric PRD targets or record an explicit alternative before optimization work. Define candidate model evaluation process.

## Parent and state

Parent: G7/G8; R-PERF. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DECIDE-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/contracts/release.md; evals/specs/. Task-specific evidence under docs/delivery/evidence/CONTRACT-05.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Name reference hardware/OS, measurement methodology, quality rubrics and dataset ownership. Ratify numeric PRD targets or record an explicit alternative before optimization work. Define candidate model evaluation process.

## Acceptance criteria

- No benchmark claims without raw evidence.
- Dataset leakage and repair results tracked.
- Required pilot is clearly owner-arranged.
- Release-ready and published are distinct.

## Verification

Reviewer checks each gate has metric, threshold, environment, task owner and artifact. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# BUILD-01 — Create workspace, scripts and CI skeleton

## Outcome

Initialize chosen runtime workspace, lint/typecheck/unit/consumer test scripts and build entrypoint. Establish package boundaries for sdk, engine, cli, providers and built-ins. Pin dependencies and create script name map.

## Parent and state

Parent: G2/G7. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-01; Accepted CONTRACT-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

package/workspace configs; src/ entrypoints; tests/; CI; lockfile. Task-specific evidence under docs/delivery/evidence/BUILD-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Initialize chosen runtime workspace, lint/typecheck/unit/consumer test scripts and build entrypoint. Establish package boundaries for sdk, engine, cli, providers and built-ins. Pin dependencies and create script name map.

## Acceptance criteria

- Fresh checkout can install locked dependencies and run baseline checks.
- No public upload action enabled.
- Generated sources are reproducible.

## Verification

Fresh install/build/check on target runner; lockfile repeatability. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CORE-01 — Implement record adapters and wire format

## Outcome

Implement text/lines/jsonl/records input adapters, bounded auto detection, IDs, source/annotations and output serializers. Preserve line boundaries and validate finite JSON values.

## Parent and state

Parent: R-DATA. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BUILD-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/engine/records/; tests/records/. Task-specific evidence under docs/delivery/evidence/CORE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement text/lines/jsonl/records input adapters, bounded auto detection, IDs, source/annotations and output serializers. Preserve line boundaries and validate finite JSON values.

## Acceptance criteria

- Header/version errors have locations.
- Final unterminated line works.
- Explicit text bypasses detection.
- Round trip preserves record identity and content.

## Verification

Adapter fixtures including malformed UTF-8/JSON, header collision, empty input and multiline values. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CORE-02 — Implement execution lifecycle and budgets

## Outcome

Build shared deadline/request/token/input limits, AbortSignal propagation, backpressure and validated emission. Distinguish record streaming from global barriers; no hidden buffering of infinite streams.

## Parent and state

Parent: R-DATA/R-PERF. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CORE-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/engine/execution/; tests/execution/. Task-specific evidence under docs/delivery/evidence/CORE-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Build shared deadline/request/token/input limits, AbortSignal propagation, backpressure and validated emission. Distinguish record streaming from global barriers; no hidden buffering of infinite streams.

## Acceptance criteria

- Take cancels upstream.
- Ctrl-C aborts HTTP and runtime work.
- Context/byte limits error explicitly.
- Timeout and repair attempts share budgets.

## Verification

Fake slow producer/provider; oversized input; cancellation; expected pipe close vs write failure; RSS check. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# SDK-01 — Implement typed command SDK

## Outcome

Implement defineCommand/action generics, separate config/args/input/output validation, execution modes and contexts. Infer execute argument and result types from schemas.

## Parent and state

Parent: R-EXT. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BUILD-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/sdk/; tests/sdk/; consumer fixtures. Task-specific evidence under docs/delivery/evidence/SDK-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement defineCommand/action generics, separate config/args/input/output validation, execution modes and contexts. Infer execute argument and result types from schemas.

## Acceptance criteria

- Invalid output after postprocessing fails.
- Optional/default fields infer correctly.
- A consumer compiles without runtime-internal imports.

## Verification

Positive/negative type fixtures plus runtime parsing tests; compile external consumer. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# SDK-02 — Generate manifests and CLI schema bindings

## Outcome

Export supported schemas, descriptions, defaults, examples and flag metadata; reject unsupported Zod constructs and reserved collisions; deterministic content hashes.

## Parent and state

Parent: R-EXT/G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted SDK-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/sdk/manifest/; src/build/schema/; tests/manifests/. Task-specific evidence under docs/delivery/evidence/SDK-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Export supported schemas, descriptions, defaults, examples and flag metadata; reject unsupported Zod constructs and reserved collisions; deterministic content hashes.

## Acceptance criteria

- One source drives help, schema and completions.
- Nested args support JSON.
- Stale schema cache is detectable.
- No hand-authored duplicate schema.

## Verification

Golden semantic manifests; export rejection tests; regenerate twice and compare bytes. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# EXT-01 — Build and explicitly install local extensions

## Outcome

Bundle local TS sources and pinned dependencies using selected runtime, record source hashes and SDK version, activate install transactionally. Keep metadata inspection separate from module loading.

## Parent and state

Parent: R-EXT. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted SDK-02; Accepted CORE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/extensions/build/; src/extensions/install/; tests/extensions/. Task-specific evidence under docs/delivery/evidence/EXT-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Bundle local TS sources and pinned dependencies using selected runtime, record source hashes and SDK version, activate install transactionally. Keep metadata inspection separate from module loading.

## Acceptance criteria

- Uninstalled repo files never execute.
- Normal invocation does not download code.
- Changed sources require rebuild.
- Failed add leaves prior install usable.

## Verification

Side-effect import fixture; no-network invocation; stale hash; rollback on failed build; remove leaves user source intact. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# EXT-02 — Execute extension actions through shared engine

## Outcome

Dispatch installed actions, inject budgets/logger/signal/managed inference interface and validate outputs. Distinguish extension execution errors from provider errors.

## Parent and state

Parent: G2/R-EXT. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-01; Accepted SDK-01; Accepted CORE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/extensions/runtime/; tests/extensions/runtime/. Task-specific evidence under docs/delivery/evidence/EXT-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Dispatch installed actions, inject budgets/logger/signal/managed inference interface and validate outputs. Distinguish extension execution errors from provider errors.

## Acceptance criteria

- Built-in and third-party actions take identical path.
- Arbitrary TS exceptions become structured sanitized errors.
- Stream modes honor cancellation.

## Verification

Consumer action, thrown error, malformed output, cancellation and iterable cleanup tests. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CLI-01 — Implement parser and shell behavior

## Outcome

Generate flags and positionals from manifests; add runtime flags and management JSON/error formatting; implement stdin/file ambiguity and stable exit taxonomy.

## Parent and state

Parent: G1/G5. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted SDK-02; Accepted CORE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/cli/parser/; src/cli/io/; tests/cli/. Task-specific evidence under docs/delivery/evidence/CLI-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Generate flags and positionals from manifests; add runtime flags and management JSON/error formatting; implement stdin/file ambiguity and stable exit taxonomy.

## Acceptance criteria

- Conflicting args-json/flags fail before inference.
- Unknown args point to schema path.
- Stdout stays clean.
- No TTY prompt in CI.

## Verification

Spawn CLI subprocesses for quoting, flags, file/stdin collisions, diagnostics and exit cases. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CLI-02 — Implement catalog, discovery and completion

## Outcome

Implement commands/types list and describe, help and bash/zsh/fish completions from manifests. Include schemaVersion and side effects metadata.

## Parent and state

Parent: G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CLI-01; Accepted EXT-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/cli/catalog/; src/cli/completions/; tests/catalog/. Task-specific evidence under docs/delivery/evidence/CLI-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement commands/types list and describe, help and bash/zsh/fish completions from manifests. Include schemaVersion and side effects metadata.

## Acceptance criteria

- Works outside initialized repo.
- No inference/import during discovery.
- Named definitions show type/action and effective argument contract.

## Verification

Instrument module import/network counts at zero; completion smoke fixtures; JSON schema validation. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# ROUTE-01 — Implement configuration and route resolver

## Outcome

Load global/project config with explicit paths, named providers/profiles and per-command rules. Implement the ratified precedence table and field provenance.

## Parent and state

Parent: G4/R-ROUTE. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted BUILD-01; Accepted CONTRACT-03

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/config/; src/routing/; tests/routing/. Task-specific evidence under docs/delivery/evidence/ROUTE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Load global/project config with explicit paths, named providers/profiles and per-command rules. Implement the ratified precedence table and field provenance.

## Acceptance criteria

- All routing contract fixtures pass.
- Profile resets and provider-only defaults behave consistently.
- Unknown route returns error before input is sent.

## Verification

Full table-driven resolver suite including force-profile and invalid profile/model combinations. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# ROUTE-02 — Implement provider/profile management and inspection

## Outcome

Add list/add/remove providers, profiles list/show/set/remove and route inspect. Store apiKeyEnv reference, never secret values; atomic config updates.

## Parent and state

Parent: G4/G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted ROUTE-01; Accepted CLI-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/cli/providers/; src/cli/profiles/; src/cli/route/; tests/config-cli/. Task-specific evidence under docs/delivery/evidence/ROUTE-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Add list/add/remove providers, profiles list/show/set/remove and route inspect. Store apiKeyEnv reference, never secret values; atomic config updates.

## Acceptance criteria

- No secret displayed or placed in manifest.
- Config corruption does not overwrite prior config.
- Inspect makes no network calls.

## Verification

Temp config homes; redaction fixtures; invalid config; interrupted write simulation. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# PROV-01 — Implement managed inference interface

## Outcome

Implement normalized text/object calls, response usage, capability declarations, repair and retry boundaries. Propagate route and budget to every call.

## Parent and state

Parent: G4/R-EXT. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted ROUTE-01; Accepted SDK-01; Accepted CORE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/providers/interface/; src/engine/inference/; tests/providers/. Task-specific evidence under docs/delivery/evidence/PROV-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement normalized text/object calls, response usage, capability declarations, repair and retry boundaries. Propagate route and budget to every call.

## Acceptance criteria

- Text streams and object responses share cancellation/stats.
- Missing usage stays unknown.
- No hidden fallback or tool calls.

## Verification

Mock adapter contract including refusal, timeout, truncated output and unsupported schema. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# PROV-02 — Implement native Ollama adapter

## Outcome

Implement supported model listing, text streaming and native structured schema calls; map errors/capabilities accurately; leave residency to provider.

## Parent and state

Parent: G4. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/providers/ollama/; tests/providers/ollama/. Task-specific evidence under docs/delivery/evidence/PROV-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement supported model listing, text streaming and native structured schema calls; map errors/capabilities accurately; leave residency to provider.

## Acceptance criteria

- Works with selected local model.
- Never auto-pulls.
- Malformed streams fail.
- Request limits enforced.

## Verification

Recorded protocol fixtures plus opt-in live Ollama smoke; report model/runtime versions. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# PROV-03 — Implement OpenAI-compatible adapter

## Outcome

Implement the contracted compatible HTTP subset, custom base URL, API-key environment lookup, streaming and structured outputs. Handle endpoint capability differences without assuming provider identity.

## Parent and state

Parent: G4. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/providers/openai-compatible/; tests/providers/compatible/. Task-specific evidence under docs/delivery/evidence/PROV-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement the contracted compatible HTTP subset, custom base URL, API-key environment lookup, streaming and structured outputs. Handle endpoint capability differences without assuming provider identity.

## Acceptance criteria

- LM Studio and hosted test endpoint have recorded conformance.
- Unsupported schema errors are actionable.
- Authorization headers never logged.

## Verification

Mock HTTP conformance and opt-in live checks with explicit credentials; no-key local endpoint case. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# PROV-04 — Implement setup, doctor and model discovery

## Outcome

Implement local-first setup, models list, provider diagnostics, model availability and optional download instructions. Respect non-TTY usage and existing config.

## Parent and state

Parent: G4/G8. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted PROV-02; Accepted PROV-03; Accepted ROUTE-02; Accepted CLI-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/cli/setup/; src/cli/doctor/; tests/setup/. Task-specific evidence under docs/delivery/evidence/PROV-04.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement local-first setup, models list, provider diagnostics, model availability and optional download instructions. Respect non-TTY usage and existing config.

## Acceptance criteria

- No remote fallback or automatic model download.
- Setup shows evidence for local suggestion.
- Doctor separates config errors from absent runtime/model.

## Verification

Fresh config, unreachable endpoints, no model, unsupported model, CI and repeated setup tests. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CMD-01 — Ship ask, summarize, explain and rewrite

## Outcome

Author four public types through SDK with common prompting and additive rules. Implement summarize word ceiling via validated result/one repair rather than silent destructive truncation.

## Parent and state

Parent: C01–C04. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/text/; fixtures/text/; tests/text/. Task-specific evidence under docs/delivery/evidence/CMD-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Author four public types through SDK with common prompting and additive rules. Implement summarize word ceiling via validated result/one repair rather than silent destructive truncation.

## Acceptance criteria

- All four expose schema/help/examples.
- Exact requested max words enforced or explicit failure.
- Inputs treated as data.
- No shell actions.

## Verification

Mock prompt/output tests and adversarial evidence inputs; semantic fixtures passed to EVAL-02. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CMD-02 — Ship extract and classify

## Outcome

Support schema file extraction, missing-value policy, finite label classification, original records and annotation namespaces. Validate candidate labels by identity, not loose text parsing.

## Parent and state

Parent: C05–C06. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/structured/; fixtures/structured/; tests/structured/. Task-specific evidence under docs/delivery/evidence/CMD-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Support schema file extraction, missing-value policy, finite label classification, original records and annotation namespaces. Validate candidate labels by identity, not loose text parsing.

## Acceptance criteria

- Invalid/unsupported schema fails before inference.
- No invented class.
- Repaired responses counted.
- Output never emits invalid schema.

## Verification

Missing facts, unknown label, malicious input, invalid JSON/refusal and postprocess validation tests. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CMD-03 — Ship filter and map

## Outcome

Implement per-record decision/transform with bounded batching and concurrency. Preserve filter record bytes as data values; map emits one result with lineage.

## Parent and state

Parent: C07/C10. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/records/; tests/records-semantic/. Task-specific evidence under docs/delivery/evidence/CMD-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement per-record decision/transform with bounded batching and concurrency. Preserve filter record bytes as data values; map emits one result with lineage.

## Acceptance criteria

- Stable ordering under out-of-order HTTP completions.
- Filter cannot rewrite originals.
- Failures stop without fabricated records.
- Budgets cap work.

## Verification

Interleaved mock responses, false/true decisions, empty streams, one-to-one map, cancellation. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CMD-04 — Ship rank and group

## Outcome

Implement bounded global operations using opaque IDs for selections/assignments. Validate permutation and partition before output. Top slicing follows complete valid rank.

## Parent and state

Parent: C08–C09. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/global/; tests/rank-group/. Task-specific evidence under docs/delivery/evidence/CMD-04.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement bounded global operations using opaque IDs for selections/assignments. Validate permutation and partition before output. Top slicing follows complete valid rank.

## Acceptance criteria

- Duplicate/unknown/omitted IDs rejected or repaired within budget.
- Every group member is original.
- No silent sampling above 200 default records.

## Verification

Permutation/property tests; malformed IDs; duplicate partition membership; empty/single/oversized inputs. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CMD-05 — Ship reduce and compare

## Outcome

Implement whole-input reduction and two-source comparison. Add explicit chunked reduction with source/chunk lineage and shared call budget; keep default exact bounded input behavior.

## Parent and state

Parent: C11–C12. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/reduce/; src/builtins/compare/; tests/reduce-compare/. Task-specific evidence under docs/delivery/evidence/CMD-05.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement whole-input reduction and two-source comparison. Add explicit chunked reduction with source/chunk lineage and shared call budget; keep default exact bounded input behavior.

## Acceptance criteria

- No truncation on overflow.
- Compare preserves file labels.
- Chunked approximation visible in stats.
- Empty evidence follows contract.

## Verification

Boundary/context/byte tests, two-source confusion fixtures, chunk budget exhaustion and lineage checks. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CMD-06 — Ship deterministic projection and sequence helpers

## Outcome

Implement select, stable typed sort, exact unique with canonical JSON equality and streaming take. Declare barrier behavior for sort and memory accounting for unique.

## Parent and state

Parent: C18–C21. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/exact/; tests/exact/. Task-specific evidence under docs/delivery/evidence/CMD-06.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement select, stable typed sort, exact unique with canonical JSON equality and streaming take. Declare barrier behavior for sort and memory accounting for unique.

## Acceptance criteria

- Zero provider calls.
- Missing fields/mixed sort types explicit.
- Unique keeps first.
- Take zero does not consume upstream.

## Verification

Property tests for stable ordering/equality; 100k record stream; early termination; nested field errors. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# CMD-07 — Ship render and safe templates

## Outcome

Implement table/text/JSON/JSONL and literal field templates. Escape terminal controls in display modes while preserving machine data; template lookup never evals code.

## Parent and state

Parent: C22. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-02; Accepted CLI-01; Accepted CONTRACT-04

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/render/; tests/render/. Task-specific evidence under docs/delivery/evidence/CMD-07.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement table/text/JSON/JSONL and literal field templates. Escape terminal controls in display modes while preserving machine data; template lookup never evals code.

## Acceptance criteria

- Missing placeholders fail clearly.
- Output values are not accidentally rewrapped.
- Arbitrary template text cannot spawn code.

## Verification

Template injection, Unicode widths, empty table, nested objects and JSON round trips. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FS-01 — Implement traversal and text readers

## Outcome

Implement ignore precedence, root/symlink handling, metadata and bounded UTF-8 reads; explicit binary and permission errors. Record omission reasons only for opt-in skip mode.

## Parent and state

Parent: R-FS. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CORE-01; Accepted CORE-02; Accepted CONTRACT-04

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/filesystem/; tests/filesystem/. Task-specific evidence under docs/delivery/evidence/FS-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Implement ignore precedence, root/symlink handling, metadata and bounded UTF-8 reads; explicit binary and permission errors. Record omission reasons only for opt-in skip mode.

## Acceptance criteria

- Cycles cannot hang traversal.
- No outside-root read by default.
- Hostile names retain original paths.
- Limits do not silently drop candidates.

## Verification

Temporary tree with symlinks, hidden/ignored/sensitive files, binary, permissions and boundary sizes. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FS-02 — Ship ls and read

## Outcome

Expose metadata listing and multi-file content records through standard schema/serialization. Preserve source boundaries and exact content.

## Parent and state

Parent: C13/C17. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FS-01; Accepted EXT-02; Accepted CLI-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/ls/; src/builtins/read/; tests/fs-commands/. Task-specific evidence under docs/delivery/evidence/FS-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Expose metadata listing and multi-file content records through standard schema/serialization. Preserve source boundaries and exact content.

## Acceptance criteria

- No provider configuration needed.
- File order is deterministic and documented.
- Explicit binary read errors.
- Record output feeds pick/select.

## Verification

Fixture tree and multi-file tests; zero network calls; pipeline roundtrip. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FS-03 — Ship semantic find

## Outcome

Apply exact glob/kind filters before optional semantic predicate. Names evidence default; content reads only explicit; candidate IDs validate selections.

## Parent and state

Parent: C14. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FS-02; Accepted CMD-03

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/find/; tests/find/. Task-specific evidence under docs/delivery/evidence/FS-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Apply exact glob/kind filters before optional semantic predicate. Names evidence default; content reads only explicit; candidate IDs validate selections.

## Acceptance criteria

- Model cannot create paths.
- Ignored candidates never sent.
- Budget exceeded errors before inference.
- Unchanged record metadata survives.

## Verification

Captured mock payload confirms candidate scope; bogus model path; names/content evidence differential. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FS-04 — Ship tree with semantic annotations

## Outcome

Render real hierarchy with depth and optional descriptions/relevance. Preserve ancestors and mark description evidence basis. Structured tree output available.

## Parent and state

Parent: C15. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FS-02; Accepted CMD-01; Accepted CMD-03

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/tree/; tests/tree/. Task-specific evidence under docs/delivery/evidence/FS-04.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Render real hierarchy with depth and optional descriptions/relevance. Preserve ancestors and mark description evidence basis. Structured tree output available.

## Acceptance criteria

- Metadata-only tree zero inference.
- No fabricated nodes.
- --about retains ancestor chain.
- Omission/error behavior matches FS contract.

## Verification

Golden topology fixtures, content opt-in payloads, unknown-node rejection, depth boundary and terminal escape cases. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FS-05 — Ship interactive pick with backend integration

## Outcome

Integrate chosen fzf backend via argv and opaque ID transport; require controlling terminal; optional semantic rank then lexical interaction. Validate returned IDs.

## Parent and state

Parent: C16. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FS-02; Accepted CMD-04

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/builtins/pick/; src/interactive/; tests/pick/. Task-specific evidence under docs/delivery/evidence/FS-05.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Integrate chosen fzf backend via argv and opaque ID transport; require controlling terminal; optional semantic rank then lexical interaction. Validate returned IDs.

## Acceptance criteria

- Multiselect preserves originals.
- Cancel/no-TTY/missing backend explicit.
- Hostile labels cannot alter arguments.
- No output UI bytes on stdout.

## Verification

PTY integration tests with tabs/newlines/ANSI; simulated backend unknown IDs; no-TTY and cancellation. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FLOW-01 — Implement YAML definitions and resolution

## Outcome

Parse strict versioned YAML, validate type/version/action/config/defaults, resolve installed names and generate named command help. Reject executable YAML tags and duplicate keys.

## Parent and state

Parent: G3/R-FLOW. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted SDK-02; Accepted ROUTE-01; Accepted CLI-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/definitions/; src/cli/run/; tests/definitions/. Task-specific evidence under docs/delivery/evidence/FLOW-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Parse strict versioned YAML, validate type/version/action/config/defaults, resolve installed names and generate named command help. Reject executable YAML tags and duplicate keys.

## Acceptance criteria

- Definition cannot shadow built-in silently.
- Exact type version validated.
- Invocation override does not mutate YAML.
- Schema errors include paths.

## Verification

Positive/negative definitions, duplicate keys/names, stale type version and CLI args override. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FLOW-02 — Implement typed linear flow planner

## Outcome

Parse linear steps/references and inline :: syntax, validate references and detectable schema mismatches, resolve step routes and declare streaming/barrier boundaries.

## Parent and state

Parent: G3/R-FLOW. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FLOW-01; Accepted CONTRACT-04

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/flows/plan/; tests/flows/plan/. Task-specific evidence under docs/delivery/evidence/FLOW-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Parse linear steps/references and inline :: syntax, validate references and detectable schema mismatches, resolve step routes and declare streaming/barrier boundaries.

## Acceptance criteria

- Plan performs no model call or extension import.
- Future/missing refs rejected.
- Force-profile visible.
- Quoted prompt content preserved.

## Verification

Flow contract fixture suite; route plan snapshots; payload argument quoting cases. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FLOW-03 — Execute flows with shared runtime and limits

## Outcome

Execute prior-output bindings as typed values, retain lineage and share total budget/signal. Avoid repeated runtime startup within flow; no automatic stage fusion.

## Parent and state

Parent: G3/G4. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FLOW-02; Accepted EXT-02; Accepted PROV-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/flows/run/; tests/flows/run/. Task-specific evidence under docs/delivery/evidence/FLOW-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Execute prior-output bindings as typed values, retain lineage and share total budget/signal. Avoid repeated runtime startup within flow; no automatic stage fusion.

## Acceptance criteria

- Failure stops subsequent steps.
- Step routes honor precedence.
- Structured outputs revalidated at boundaries.
- Deterministic step zero inference.

## Verification

Mixed mock-provider flow, cancellation at barrier, partial stream failure, global budget exhaustion. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# AGENT-01 — Implement scaffolding and fixture runner

## Outcome

Scaffold typed source, fixture tests and sample definition using public SDK. extensions check/test emit machine errors with file/schema paths. Separate mock tests and opt-in live evals.

## Parent and state

Parent: G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EXT-01; Accepted SDK-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

src/cli/extensions/; templates/extension/; tests/scaffold/. Task-specific evidence under docs/delivery/evidence/AGENT-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Scaffold typed source, fixture tests and sample definition using public SDK. extensions check/test emit machine errors with file/schema paths. Separate mock tests and opt-in live evals.

## Acceptance criteria

- Scaffold builds without edits.
- Invalid fixture fails with corrective location.
- Scaffold never overwrites existing source without explicit option.

## Verification

Fresh external fixture project; conflict path; invalid schema and mock inference fixtures. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# AGENT-02 — Ship agent guidance initialization

## Outcome

Write opt-in tool-specific entrypoints and one canonical authoring guide with discover-configure-extend-test-compose loop. Merge using marked owned sections and avoid rewriting unrelated guidance.

## Parent and state

Parent: G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted AGENT-01; Accepted CLI-02; Accepted FLOW-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

templates/agent-guidance/; src/cli/init/; tests/init/. Task-specific evidence under docs/delivery/evidence/AGENT-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Write opt-in tool-specific entrypoints and one canonical authoring guide with discover-configure-extend-test-compose loop. Merge using marked owned sections and avoid rewriting unrelated guidance.

## Acceptance criteria

- Repeated init idempotent.
- Works for codex/claude/cursor/opencode.
- Agent examples reference only real public commands.

## Verification

Golden initialized repos including existing instruction files; repeat init and changed-template upgrade. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# AGENT-03 — Run independent agent consumer evaluation

## Outcome

Run 10 bounded consumer tasks using packaged SDK/CLI and public docs only: reuse definitions, add typed logic, inspect routes, repair errors, compose flows. Use agents only when authorized in the implementation session.

## Parent and state

Parent: G6/R-PERF. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted AGENT-02; Accepted FLOW-03; Accepted CMD-01; Accepted CMD-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

evals/agent/; docs/delivery/evidence/AGENT-03.md. Task-specific evidence under docs/delivery/evidence/AGENT-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Run 10 bounded consumer tasks using packaged SDK/CLI and public docs only: reuse definitions, add typed logic, inspect routes, repair errors, compose flows. Use agents only when authorized in the implementation session.

## Acceptance criteria

- At least 8/10 meet rubrics.
- Failed attempts retained.
- No runtime internals supplied.
- No manual task-specific patch hidden as agent success.

## Verification

Record prompts, environment, tool calls, outputs, failures and reviewer scoring. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# QA-01 — Build adversarial conformance suite

## Outcome

Combine hostile text, filenames, extension imports, provider errors and route conflicts in end-to-end tests. Test that input instructions cannot trigger shell execution or route changes.

## Parent and state

Parent: G5/G8. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FLOW-03; Accepted FS-05; Accepted CMD-07

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

tests/conformance/; fixtures/adversarial/. Task-specific evidence under docs/delivery/evidence/QA-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Combine hostile text, filenames, extension imports, provider errors and route conflicts in end-to-end tests. Test that input instructions cannot trigger shell execution or route changes.

## Acceptance criteria

- Zero data-dependent route changes.
- Zero implicit extension execution.
- Stderr redaction.
- Every exit/error category exercised.

## Verification

Packaged CLI integration suite on both supported OS targets. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# EVAL-01 — Create labeled semantic datasets and rubrics

## Outcome

Create provenance-documented synthetic/public permitted fixtures meeting PRD counts, held-out splits and reviewer labels. Include unknown/missing facts and adversarial records.

## Parent and state

Parent: G7. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-05

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

evals/datasets/; evals/rubrics/; docs/delivery/evidence/. Task-specific evidence under docs/delivery/evidence/EVAL-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Create provenance-documented synthetic/public permitted fixtures meeting PRD counts, held-out splits and reviewer labels. Include unknown/missing facts and adversarial records.

## Acceptance criteria

- Counts and label agreement reported.
- No confidential production data.
- Held-out set distinct from prompt tuning set.
- Rubrics score factuality independently of schema.

## Verification

Dataset schema checks, duplicate/leakage checks and reviewer sample audit. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# EVAL-02 — Select default small local model and evaluate commands

## Outcome

Evaluate candidate small models and a larger local reference on frozen fixtures; record first-pass and repair quality, cold/warm latency and quantization. Select default only if gates pass.

## Parent and state

Parent: G7. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted EVAL-01; Accepted PROV-02; Accepted PROV-03; Accepted CMD-01; Accepted CMD-02; Accepted CMD-03; Accepted CMD-04; Accepted CMD-05; Accepted FS-03; Accepted FS-04

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

evals/results/; docs/models.md; default model config. Task-specific evidence under docs/delivery/evidence/EVAL-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Evaluate candidate small models and a larger local reference on frozen fixtures; record first-pass and repair quality, cold/warm latency and quantization. Select default only if gates pass.

## Acceptance criteria

- All required semantic thresholds met or release blocked.
- Unsupported hardware requirements visible.
- No claim that a model is fast without environment.

## Verification

Three runs per candidate/test family; archived aggregate/raw metrics and reviewer rubric scores. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# PERF-01 — Measure and optimize runtime overhead

## Outcome

Measure CLI/extension startup, manifest discovery, stream RSS and provider-independent overhead. Optimize measured bottlenecks without changing contracts; record cold and warm separately.

## Parent and state

Parent: G7. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted CONTRACT-05; Accepted FLOW-03; Accepted FS-05; Accepted CMD-06; Accepted CMD-07

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

benchmarks/; selected engine hot paths; docs/performance.md. Task-specific evidence under docs/delivery/evidence/PERF-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Measure CLI/extension startup, manifest discovery, stream RSS and provider-independent overhead. Optimize measured bottlenecks without changing contracts; record cold and warm separately.

## Acceptance criteria

- Ratified p95/RSS budgets pass.
- Exact commands make zero inference calls.
- No benchmark regression hidden by altered workload.

## Verification

Reproducible runner with repetitions, baseline/candidate diffs and raw samples. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# SHIP-01 — Package installable artifacts for target platforms

## Outcome

Produce private release candidate binaries/packages with version metadata, locked dependencies and checksums. Include bundled SDK templates/manifests, document fzf and provider prerequisites.

## Parent and state

Parent: G8. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted QA-01; Accepted PERF-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

build/release/; packaging scripts; CI packaging jobs. Task-specific evidence under docs/delivery/evidence/SHIP-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Produce private release candidate binaries/packages with version metadata, locked dependencies and checksums. Include bundled SDK templates/manifests, document fzf and provider prerequisites.

## Acceptance criteria

- Fresh machines can run help and deterministic tools without compiler.
- Installed extension works offline after build.
- No public publishing triggered.

## Verification

Clean install/uninstall smoke on macOS arm64/Linux x86_64; verify checksums and version. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# DOCS-01 — Write complete command, SDK and routing docs

## Outcome

Write quickstart, all 22 command references, modes/errors/limits, routing precedence, executable trust model and extension authoring. Create the three signature demos and six PRD use cases.

## Parent and state

Parent: G1/G6. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted FLOW-03; Accepted FS-05; Accepted AGENT-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/user/; docs/sdk/; examples/. Task-specific evidence under docs/delivery/evidence/DOCS-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Write quickstart, all 22 command references, modes/errors/limits, routing precedence, executable trust model and extension authoring. Create the three signature demos and six PRD use cases.

## Acceptance criteria

- All examples map to actual schemas.
- Routing examples resolve as stated.
- No unsupported provider claim.
- Built-ins and extension paths both taught.

## Verification

Run all examples with fixtures/mocks; flag optional live examples; generated reference freshness check. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# DOCS-02 — Verify docs against packaged CLI

## Outcome

Execute quickstart/demos against installed package, not source; check file paths, flags, schemas and no-network discovery. Verify help matches manual.

## Parent and state

Parent: G1/G8. Class: Required. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DOCS-01; Accepted SHIP-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

tests/docs-consumer/; docs/delivery/evidence/DOCS-02.md. Task-specific evidence under docs/delivery/evidence/DOCS-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Execute quickstart/demos against installed package, not source; check file paths, flags, schemas and no-network discovery. Verify help matches manual.

## Acceptance criteria

- No prose-only imaginary flags.
- 22-command coverage table complete.
- Accessible plain output and terminal examples usable.

## Verification

Executable snippets suite; packaged external extension walkthrough. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# PILOT-01 — Validate first-run and recurring use cases with owner-selected users

## Outcome

Owner arranges five private pilot sessions; observe local setup and at least one signature workflow, record download time separately and identify blockers. Do not contact anyone without authorization.

## Parent and state

Parent: G8/R-PERF. Class: Required human evidence. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted DOCS-02; Accepted EVAL-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/evidence/PILOT-01.md; anonymized observations. Task-specific evidence under docs/delivery/evidence/PILOT-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Owner arranges five private pilot sessions; observe local setup and at least one signature workflow, record download time separately and identify blockers. Do not contact anyone without authorization.

## Acceptance criteria

- At least 4/5 meet setup target excluding download.
- Evidence is real users, not simulations.
- Blockers enter tracked tasks.

## Verification

Timestamped observation rubric, environment and user feedback; no private identifiers needed. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# RELEASE-01 — Audit complete initial scope and release evidence

## Outcome

Verify every Required and Required gate task is ACCEPTED, all 22 commands map to tests/docs, routing/SDK contracts match shipped schema, and all risks/unverified items are disclosed.

## Parent and state

Parent: G1–G8. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted AGENT-03; Accepted EVAL-02; Accepted PERF-01; Accepted DOCS-02; Accepted PILOT-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/delivery/evidence/RELEASE-01.md; release checklist. Task-specific evidence under docs/delivery/evidence/RELEASE-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Verify every Required and Required gate task is ACCEPTED, all 22 commands map to tests/docs, routing/SDK contracts match shipped schema, and all risks/unverified items are disclosed.

## Acceptance criteria

- No required task missing or unverified gate counted as passed.
- Fresh package artifacts and evidence refer to same revision.
- Complete owner-reviewable release candidate.

## Verification

Traceability validator, dependency acceptance audit, clean candidate conformance and evidence review. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# RELEASE-02 — Prepare private launch decision packet

## Outcome

Summarize candidate version, install artifacts, known limits, measured results and unresolved name/licensing decisions. Keep publishing separate; do not make repo/package/site public.

## Parent and state

Parent: G8. Class: Required gate. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted RELEASE-01

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

docs/launch-decision.md; private release notes. Task-specific evidence under docs/delivery/evidence/RELEASE-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Summarize candidate version, install artifacts, known limits, measured results and unresolved name/licensing decisions. Keep publishing separate; do not make repo/package/site public.

## Acceptance criteria

- Owner can approve a concrete candidate.
- Private delivery is complete.
- Publication remains pending explicit instruction.

## Verification

Check all artifact links/checksums and documented limitations against RELEASE-01. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FOLLOW-01 — Explore additional native providers

## Outcome

Prioritize native APIs based on concrete user demand; reuse capability contract and conformance suite.

## Parent and state

Parent: Deferred. Class: Post-release. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted RELEASE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

future provider RFC. Task-specific evidence under docs/delivery/evidence/FOLLOW-01.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Prioritize native APIs based on concrete user demand; reuse capability contract and conformance suite.

## Acceptance criteria

- New adapter scoped by documented need and protocol tests.
- No speculative changes to v1.

## Verification

Provider-specific RFC and tests when activated. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FOLLOW-02 — Explore branching flows and nested invocation

## Outcome

Evaluate DAG/nested flow needs with limits, retries and error semantics; keep v1 linear contract stable.

## Parent and state

Parent: Deferred. Class: Post-release. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted RELEASE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

future flow RFC. Task-specific evidence under docs/delivery/evidence/FOLLOW-02.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Evaluate DAG/nested flow needs with limits, retries and error semantics; keep v1 linear contract stable.

## Acceptance criteria

- Proposal includes compatibility story, cycle detection and bounded execution.

## Verification

Representative user workflows and planner tests when activated. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FOLLOW-03 — Explore sandboxed extension distribution

## Outcome

Evaluate enforcement and distribution before introducing marketplace installs or trust claims.

## Parent and state

Parent: Deferred. Class: Post-release. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted RELEASE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

future extension RFC. Task-specific evidence under docs/delivery/evidence/FOLLOW-03.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Evaluate enforcement and distribution before introducing marketplace installs or trust claims.

## Acceptance criteria

- Threat model and real permission enforcement validated independently of manifest declarations.

## Verification

Adversarial runtime proof when activated. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FOLLOW-04 — Explore filesystem mutations and plan/apply

## Outcome

Define inspectable deterministic plans, path revalidation and failure recovery before copy/move/edit commands.

## Parent and state

Parent: Deferred. Class: Post-release. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted RELEASE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

future filesystem RFC. Task-specific evidence under docs/delivery/evidence/FOLLOW-04.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Define inspectable deterministic plans, path revalidation and failure recovery before copy/move/edit commands.

## Acceptance criteria

- No model-generated shell execution.
- Changes require a separately designed effect contract.

## Verification

Mutation/recovery scenario matrix when activated. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.


---

# FOLLOW-05 — Explore wider platforms, ingestion and indexing

## Outcome

Prioritize Windows/Linux arm64, document conversion and indexing separately using real usage evidence.

## Parent and state

Parent: Deferred. Class: Post-release. Initial state: **BLOCKED**. Current state is maintained in backlog.md.

## Prerequisites

Accepted RELEASE-02

## Required reading

[PRD](../../PRD.md), [execution rules](../README.md), [CLI/data](../contracts/cli-data.md), [extension](../contracts/extensions.md), [routing](../contracts/routing.md), [flow/filesystem](../contracts/flows-filesystem.md), and [release](../contracts/release.md) contracts as relevant to the parent above. Read existing files and callers within allowed scope; review prerequisite evidence before edits.

## Allowed edits

future platform/ingestion RFCs. Task-specific evidence under docs/delivery/evidence/FOLLOW-05.md. Paths are mapped to real repository equivalents by BASE-01; no existing implementation is assumed.

## Exact change

Prioritize Windows/Linux arm64, document conversion and indexing separately using real usage evidence.

## Acceptance criteria

- Each feature has its own resource/security/portability budget.
- No implicit expansion of v1 support.

## Verification

Platform or data-format consumer tests when activated. Use the actual script mapping from BUILD-01. Capture exact commands, exit codes and revision; do not report mocks as live-provider validation or static inspection as runtime evidence.

## Forbidden scope

Unrelated refactors; undocumented public APIs; weakening tests or budgets; silent scope cuts; arbitrary upstream code copying; publishing, outreach or credential creation. Post-release ideas must not enter required implementation implicitly.

## Stop conditions

An unaccepted prerequisite, contradictory contract, unsupported external capability, or need to edit outside allowed scope. Record the specific blocker and proposed task amendment. A failed acceptance gate remains failed until resolved with evidence or explicitly revised.

## Review evidence

Per-criterion PASS/FAIL/UNVERIFIED table; revision/environment; files changed; verification commands and outcomes; relevant fixtures or measurements; known limits; reviewer acceptance decision. No evidence exists yet.

