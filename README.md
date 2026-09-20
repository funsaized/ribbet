# 🐸 Ribbit

**Small commands. Big hops.**

Put models in your shell pipelines. Let a small local model label or reshape the input, keep the evidence, then hand it to a stronger model or coding harness.

[Documentation](https://funsaized.github.io/ribbet/) · [First tutorial](docs/tutorials/first-pipeline.md) · [npm](https://www.npmjs.com/package/@funsaized/ribbit) · [Native downloads](https://github.com/funsaized/ribbet/releases)

```text
files / text / JSONL
        │
   exact commands
        │
  small-model step ── originals + annotations ── stronger model / harness
```

Ribbit gives each step an inspectable contract, an explicit model route, and a record format that carries IDs, source references, and annotations. A useful invocation can become a named YAML command, then a reusable flow.

## Install

```sh
npm install -g @funsaized/ribbit@alpha
ribbit --help
```

Linux, macOS, and Windows, on x64 and ARM64. npm needs Node.js >=20 and tar; it installs the matching checksum-verified GitHub asset. [Native archives](https://github.com/funsaized/ribbet/releases) run without a separate JavaScript runtime. See [installation](docs/installation.md) for platform details.

## Get a result before configuring a model

```sh
printf '{"name":"Ada","score":2}\n{"name":"Lin","score":1}\n' |
  ribbit sort --by score --type number --input jsonl |
  ribbit select name --output jsonl
```

```json
{"name":"Lin"}
{"name":"Ada"}
```

The exact commands work offline. Follow [your first pipeline](docs/tutorials/first-pipeline.md) to turn a pipe into a flow.

## Give each model a clear job

After [configuring](docs/how-to/configure-models.md) `local-small` and `stronger`, annotate feedback locally and pass every original ticket to the stronger model:

```sh
ribbit classify --field body \
  --label 'blocking=Prevents purchases' --label 'other=Other feedback' \
  --file feedback.jsonl --input jsonl --profile local-small |
  ribbit reduce 'Prioritize every ticket and cite its ID. Verify labels against the original bodies.' \
    --profile stronger
```

The stronger model can challenge a bad label because it still has the ticket body. The [guided local-model tutorial](docs/tutorials/local-model.md) supplies the input and checks; the [saved triage flow](examples/flows/triage.yaml) makes the workflow reusable.

## Build on the examples

| Job | Starting point |
| --- | --- |
| Prioritize feedback without losing tickets | [Triage flow](docs/how-to/triage-feedback.md) |
| Give a coding harness source text and relevance annotations | [Context handoff](docs/how-to/handoff-context.md) |
| Save a prompt, defaults, and a repeatable transformation | [Reusable brief tutorial](docs/tutorials/reusable-command.md) |
| Add behavior in TypeScript with Zod contracts | [Extension guide](docs/how-to/build-extension.md) |

There are 22 built-ins: text operations, record interpretation, filesystem discovery, and exact record tools. [Browse the command reference](docs/commands.md). Native Ollama and OpenAI-compatible endpoints are supported; routes stay explicit and there is no automatic cloud fallback.

## Know what the alpha promises

The native CI matrix tests commands, recipes, installed archives, and npm installation on all six targets. Semantic usefulness remains model-dependent. The [current evaluations](docs/models.md) show both successes and failures; chaining did not automatically make these fixtures faster or cheaper. Keep originals when downstream review matters.

Extensions are trusted code. Remote routes receive the evidence you send. Interactive picking requires fzf, and Windows console interaction is not covered by the Unix PTY tests. See [execution and trust](docs/explanation/trust.md) and [platform support](docs/installation.md#platform-support).

## Contribute

Read the [product requirements](Ribbit-PRD.md), [contributor guide](CONTRIBUTING.md), and [development guide](docs/development.md). The [documentation hub](docs/index.md) separates tutorials, how-to guides, reference, and explanation.

MIT licensed. The repository is `ribbet`; the product and command are **Ribbit / `ribbit`**. Report vulnerabilities through the [security policy](SECURITY.md).
