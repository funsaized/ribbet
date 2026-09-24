# Ribbit — Product requirements

Current scope: **0.1.0-alpha.2**, MIT-licensed open-source preview.

This document expands the [product direction](docs/product-direction.md) into requirements for the initial release. The [release checklist](docs/release-checklist.md) records readiness; [individual acceptance](docs/release-acceptance.md) and [model evidence](docs/models.md) record what has been tested. Requirements describe intended behavior; evaluation results establish the limits of the current implementation.

## Product promise

Ribbit is an extensible framework for composing model tasks into reusable commands, with typed contracts and inspectable evidence. It turns messy input into useful, traceable context through composable shell commands, with an explicitly chosen model at each semantic step.

A developer can give a bounded task to a small or local model, preserve its output alongside the original evidence, and pass both to a stronger model or coding harness. Ribbit supplies input handling, typed records, validation, routing, and reusable command definitions so each workflow does not have to rebuild them.

A small model is not necessarily local, and a stronger model need not be remote. The product must support these choices without assuming that chaining improves quality, latency, cost, or context size. Users should be able to compare a chain with a direct stronger-model request and understand what each stage contributes.

The product and executable are **Ribbit / `ribbit`**. The GitHub repository is `funsaized/ribbit`. Public identifiers include `@ribbit/sdk`, `.ribbit.yaml`, `ribbit/v1`, and the `$ribbit` wire marker. GitHub distributes the source and native archives. The public npm package `@funsaized/ribbit` installs the matching GitHub asset after verifying a checksum pinned in the package; the command remains `ribbit`.

## Users and problems

The primary audience is developers working in a shell or through a coding harness. They need to interpret feedback, extract facts, prepare repository context, and reuse transformations across scripts and agent sessions.

| User | Problem | Required result |
| --- | --- | --- |
| Shell user | Repeatedly copies evidence into a chat interface and repairs the output | Useful commands compose through ordinary pipes and explicit formats |
| Local-model user | A lower-capability model can do some tasks but makes consequential mistakes | Routes are task-specific; originals remain available for downstream review |
| Harness user | Needs bounded, inspectable context with real source references | A file/stdin handoff preserves admitted evidence and makes omissions explicit |
| Extension author or coding agent | Needs domain behavior beyond built-ins | One typed implementation can be inspected, tested, installed, and reused in CLI commands and flows |

Initial inputs are developer-oriented UTF-8 text, JSON values, records, source files, notes, and feedback. Traditional shell tools remain appropriate for exact operations; Ribbit's exact commands provide convenient boundaries within its record format.

## Three release workflows

| Job | Supported composition | Acceptance criterion |
| --- | --- | --- |
| Feedback triage | Project fields → local classification → stronger reduction | Every ticket and accessibility issue survives; annotations accompany originals; conclusions identify supporting ticket IDs |
| Repository handoff | Exact file discovery with content → local relevance annotations → record stream → harness | Real paths and complete admitted source text survive; even records labeled `other` remain available for review |
| Reusable transformation | Summarization → named YAML command → saved brief/rewrite flow | Defaults are inspectable, invocation overrides work, and the definition is reusable from shell and flows |

The [recipes](docs/recipes.md) provide executable fixtures and commands. Deterministic tests compare shell pipes, inline flows, and saved flows where applicable. Live evaluation compares local-only, direct-stronger, and mixed routes on the same source inputs and final-task criteria, including all stages' overhead.

## Initial release scope

All 23 built-ins remain in the alpha. Command names and supported flags come from the [command reference](docs/commands.md); examples and individual verdicts live in [command examples](docs/command-examples.md) and [acceptance](docs/release-acceptance.md).

| Commands | Product requirement |
| --- | --- |
| ask, summarize, explain, rewrite | Apply an explicit semantic instruction to supplied text or records within configured limits |
| extract | Produce schema-validated structured output; schema validity alone does not establish factual accuracy |
| compare | Compare labeled sources without mutating them and enforce a shared input budget |
| classify, filter | Annotate or select original records while preserving their identity; make filtering's information loss explicit |
| rank, group | Return valid orderings or partitions of admitted records without invented identities |
| map, reduce | Transform records or aggregate evidence with documented lineage, schemas, and bounded execution |
| ls, find, tree, read | Gather actual filesystem evidence within traversal and size policies; semantic modes require explicit routing |
| pick | Select original records through fzf on a controlling terminal; keep interaction separate from stdout |
| select, sort, unique, take, render | Perform deterministic record operations without inference |

Management includes provider/model discovery, profile configuration, route inspection, command/type discovery, named definitions, flow planning and validation, extension lifecycle, project initialization, completions, setup, and diagnostics. These surfaces need their own CLI acceptance coverage.

## Composition and data contracts

- Text, JSONL, and versioned Ribbit records have explicit input/output boundaries. Ordinary JSON must not silently become records through auto-detection.
- Record stages preserve IDs, known source references, and annotations according to their contracts. Exporting bare values with JSONL or rendering is a deliberate metadata boundary.
- stdout carries data. stderr carries diagnostics and optional statistics. Errors expose stable categories suitable for automation; partial streaming output does not imply the full invocation succeeded.
- Shell stages have separate process budgets. Linear flows share invocation budgets and apply documented per-step routing and reference rules.
- Named YAML definitions reuse a command's contract and defaults. Flows support typed references and validation without executable interpolation.
- Discovery, help, planning, and schema inspection must not execute installed extension code or contact a model merely to inspect declarations.

Detailed wire formats, exits, configuration precedence, and flow rules are defined in [usage](docs/usage.md).

## Model routing and evidence

Support native Ollama and the tested OpenAI-compatible HTTP subset. Users configure existing endpoints and exact model identifiers. Profiles and per-step overrides select routes explicitly; inspection and statistics make those decisions visible. No automatic cloud fallback or hidden escalation is allowed.

Inference has finite request, retry, repair, input, output, and time limits. Unknown token usage remains unknown. Validation and repair enforce structural contracts; they must not be presented as factual verification or invented confidence scores.

Small models may return valid JSON with wrong labels or discard relevant evidence. The flagship workflows therefore favor annotations with originals when recall matters. A filtering stage must be understood as an irreversible selection within that pipeline. Claims of context reduction must account for false negatives and downstream task quality.

Live reports must identify models, configuration, binary and fixture hashes, outputs, errors, and measured timing. Current evidence supports bounded regression claims only: it does not certify arbitrary models or general semantic reliability. Preserve failed attempts within the retained current evaluations. Keep superseded runs and planning history out of the main tree to avoid competing readiness claims.

## Harnesses and extensions

The initial harness integration is an explicit file/stdin boundary. The receiver gets inspectable records and known source references. A live local Codex handoff verifies one bounded read-only interpretation task; it is not autonomous coding certification or a guarantee for every harness.

Extensions use the TypeScript/Zod SDK with declared input, arguments, configuration, and output contracts. Authors scaffold, check, test, and install them explicitly. Installed extensions are trusted code with process, filesystem, and network access; there is no plugin sandbox. See [extension authoring](docs/extensions.md).

Built-ins do not autonomously execute model-proposed shell commands. Any tools used by a separately invoked harness remain subject to that harness's permissions and behavior.

## Distribution and trust

Ship native archives for Linux glibc x64/ARM64, macOS Intel/Apple Silicon, and Windows x64/ARM64. Each advertised archive must be built, tested, packaged, and checked from an isolated installation on its native target. Keep the executable beside its bundled `lib/`; ordinary built-in commands require no separately installed JavaScript runtime.

Interactive picking requires fzf >=0.74.3. Linux/macOS use real PTY tests. Windows console interaction remains unverified by that suite. macOS binaries are ad-hoc signed, not notarized; Windows binaries are not Authenticode signed. Additional operating systems, musl, and 32-bit builds are outside this alpha's support claim.

Provide MIT licensing, dependency notices, checksums, build metadata, installation/uninstall instructions, contributor guidance, and private vulnerability reporting. The npm installer requires Node.js >=20 and tar; native archives remain available without that wrapper. Native CI must also verify the packed npm distribution, checksum rejection, command mapping, and extension support. No telemetry, automatic model download, or bundled model weights. Configured remote endpoints receive the evidence sent to them; filesystem exclusions are not a comprehensive secret detector.

## Release acceptance and limits

1. Every built-in and management surface has applicable deterministic contract and real CLI tests, including failure behavior.
2. Every semantic command and optional semantic mode has clearly labeled live regression evidence, separate from mocked inference.
3. The three workflows have reproducible fixtures, composition checks, route visibility, and evidence-retention assertions.
4. The harness boundary is tested, with the scope of the live invocation stated precisely.
5. Documentation builds strictly and repository Markdown links resolve; installation works without maintainer configuration. Examples are maintained but not automatically executed.
6. Every published native archive passes the CI and isolated archive checks for its recorded revision.
7. Current model limitations, extension trust, platform exceptions, and licensing are documented before publication.

The owner authorized this experimental alpha under MIT. Independent held-out semantic review and a fresh-user pilot remain follow-up validation, not completed claims or alpha blockers. There is no 1.0 API stability or broad quality promise. The current regressions show that mixed-model execution can be slower and can retain more context than a direct stronger-model call.

Non-goals for this release: a DAG scheduler, hosted inference service, embedded model server, model marketplace, automatic cloud escalation, autonomous agent runtime, sandboxed extensions, or universal cost/performance improvements.
