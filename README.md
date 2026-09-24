# 🐸 Ribbit

**Model tasks that work like commands.**

Ribbit is an extensible framework for composing model tasks into reusable commands, with typed contracts and inspectable evidence. It reads UTF-8 text, JSON values, JSONL, files, and tool output; it does not claim to handle arbitrary binary input.

[Documentation](https://funsaized.github.io/ribbit/) · [First tutorial](docs/tutorials/first-pipeline.md) · [npm](https://www.npmjs.com/package/@funsaized/ribbit) · [Native downloads](https://github.com/funsaized/ribbit/releases)

## Why I built this

I kept asking frontier models to do work my shell already did well: read a failure, gather the surrounding context, and sort the reports. Most of that work was exact — parsing, selecting, validating known procedures — and only the interpretation needed a model. I wanted code for the exact parts, models for the interpretation, and something useful on the machine I actually have: a **12 GB RTX 3080 Ti**. Ribbit started as the invocations I kept reusing, then turned them into named commands and reusable flows. That is the motivation, not a measured savings claim.

## Install and run

```sh
npm install -g @funsaized/ribbit@alpha
ribbit --help
```

```sh
printf '{"name":"Ada","score":2}\n{"name":"Lin","score":1}\n' |
  ribbit sort --by score --type number --input jsonl |
  ribbit select name --output jsonl
```

**Expected output:**

```json
{"name":"Lin"}
{"name":"Ada"}
```

The exact commands work offline. npm needs Node.js >=20 and tar; it installs the matching checksum-verified GitHub asset. Linux, macOS, and Windows, on x64 and ARM64. See [installation](docs/installation.md) for platform details.

## Three guided examples

- **Investigate a failing CI check** — [guide](docs/how-to/investigate-failing-ci.md). Read a saved log, diff, and source excerpt into a bounded evidence file, then route a stronger model to a schema-constrained diagnosis. This is a controlled offline regression, not a published failing branch.
- **Prepare a date-fns contribution brief** — [guide](docs/how-to/handoff-date-fns.md). Select pinned repository files from a bounded offline fixture exactly, then annotate a brief with a local model while keeping the source excerpts.
- **Analyze an open dataset** — [guide](docs/how-to/analyze-open-data.md). Normalize the Central Park Squirrel Census, select nonempty notes exactly, and annotate a small deterministic sample. The offline sample is synthetic; live acquisition is a separate, non-transactional step.

## Composition

Ribbit gives each step an inspectable contract, an explicit model route, and a record format that carries IDs, source references, and annotations. Text and JSONL flow through ordinary pipes; a useful invocation can become a named YAML command, then a reusable flow. Exact commands such as `select`, `sort`, `where`, and `take` run without inference, and semantic commands use the profile you choose. There are 23 built-ins; [browse the command reference](docs/commands.md).

## Model arrangements

- **Exact preprocessing → local quantized instruct model.** Filter and project with exact commands, then let a small local model label or classify.
- **Exact context selection → hosted coding or reasoning model.** Gather real source with `find` and `read`, then hand the records to a stronger hosted model.
- **Local annotations → frontier review.** Annotate locally but keep every original, so a stronger model can challenge a bad label.
- **One capable model behind a reusable command.** Skip chaining entirely when one model with good defaults is enough.

Chaining is optional and is not automatically cheaper, faster, or better; a direct stronger-model request is a fair comparison. Native Ollama and tested OpenAI-compatible endpoints are supported, routes stay explicit, and there is no automatic cloud fallback.

## Extend it in TypeScript

Extensions share the same typed contracts as built-ins. A cloned directory installs with `ribbit extensions add PATH`, so one typed implementation can be reused from commands and flows. Follow [add a typed extension](docs/how-to/build-extension.md), or read the worked, read-only [GitHub PR evidence extension](examples/extensions/gh-evidence/README.md).

## What else could you build?

| Input | Output |
| --- | --- |
| Incident logs | A timeline and operations handoff |
| Merged changes | Linked release notes |
| Dependency changes | An upgrade brief |
| Support reports | Classifications that retain the originals |
| Meeting notes | Decisions and unresolved owners |
| Experiment results | A written summary |
| Research documents | Structured extraction |
| Local repository evidence | An agent handoff |

## Trust and initial evaluations

Contracts validate structure and selected invariants, not truth. Models vary, so keep originals where the documentation says they are retained. Extensions are trusted code: their declared effects are not permissions, and checking or installing one can execute it. Records do not prevent prompt injection, remote profiles receive the evidence you send, and there is no automatic cloud fallback. Read [execution and trust](docs/explanation/trust.md) and [platform support](docs/installation.md#platform-support).

The native CI matrix tests commands, recipes, installed archives, and npm installation on all six targets. The [initial evaluations](docs/models.md) report both successes and failures; chaining did not automatically make those fixtures faster or cheaper.

## Contribute

Read the [product requirements](Ribbit-PRD.md), [contributor guide](CONTRIBUTING.md), and [development guide](docs/development.md). The [documentation hub](docs/index.md) separates tutorials, how-to guides, reference, and explanation.

MIT licensed. The repository is `ribbit`; the product and command are **Ribbit / `ribbit`**. Report vulnerabilities through the [security policy](SECURITY.md).
