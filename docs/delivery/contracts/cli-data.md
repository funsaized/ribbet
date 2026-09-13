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
