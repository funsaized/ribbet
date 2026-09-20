# Ribbit

Compose small commands around local and stronger models. Turn messy input into structured facts, preserve the evidence, and pass the result to the next command or your coding harness.

Ribbit provides 22 shell commands, typed records, explicit per-command model routing, reusable YAML definitions, and linear flows. This is **v0.1.0-alpha.1, the first experimental open-source preview**. Semantic behavior is experimental; see the [release checklist](docs/release-checklist.md) for actual evidence and blockers.

Native release targets: Linux, macOS, and Windows, each on x64 and ARM64. See [platform support](docs/installation.md#platform-support) for validation and terminal requirements.

## Try it without a model

Install the alpha from [npm](https://www.npmjs.com/package/@funsaized/ribbit):

```sh
npm install -g @funsaized/ribbit@alpha
ribbit --help
```

The npm installer requires Node.js >=20 and tar, and downloads the matching checksum-verified native GitHub release. Direct [native archives](https://github.com/funsaized/ribbet/releases) need no separately installed JavaScript runtime. To build from source, use Bun 1.4.0 and npm:

```sh
npm ci --ignore-scripts
npm run build
printf '{"name":"Ada","score":2}\n{"name":"Lin","score":1}\n' |
  ./dist/ribbit sort --by score --type number --input jsonl |
  ./dist/ribbit select name |
  ./dist/ribbit render --as table
```

The result is a `name` column with Lin, then Ada. No inference occurs.

## Give each model a bounded job

Configure your own installed models as `local-small` and `stronger` using the [setup guide](docs/installation.md). Both profiles can point to local models.

```sh
./dist/ribbit flow plan examples/flows/triage.yaml
./dist/ribbit flow run examples/flows/triage.yaml \
  --file fixtures/release/feedback.jsonl --input jsonl
```

The flow projects fields, classifies each ticket locally, then sends every original ticket plus its label to the stronger model for prioritization. Local labels are suggestions. Evidence is retained so the next stage can catch mistakes.

## Choose a command

| Job | Commands |
| --- | --- |
| Work with text | ask, summarize, explain, rewrite, extract, compare |
| Interpret records | classify, filter, rank, group, map, reduce |
| Gather source evidence | ls, find, tree, read, pick |
| Compose exact operations | select, sort, unique, take, render |

Ribbit records preserve IDs, source references, and annotations between commands. `--output jsonl` exports bare values and drops that metadata. Keep the default record format until a deliberate export or display boundary.

- [Three runnable recipes](docs/recipes.md): feedback triage, repository-to-harness context, reusable commands.
- [Installation and local setup](docs/installation.md).
- [Usage and data contracts](docs/usage.md), [command reference](docs/commands.md), and [command examples](docs/command-examples.md).
- [Model evidence](docs/models.md), [product direction](docs/product-direction.md), [product requirements](Ribbit-PRD.md), and [release checklist](docs/release-checklist.md).
- [Extension authoring](docs/extensions.md) and [contributing](CONTRIBUTING.md).

No automatic cloud fallback, telemetry, or model downloads. Configured remote routes receive the evidence you supply. Installed extensions are trusted executable code with filesystem, network, and process access. See [security](SECURITY.md).

Released under the [MIT license](LICENSE). Download native artifacts from [GitHub Releases](https://github.com/funsaized/ribbet/releases). The repository is named `ribbet`; the product and executable are **Ribbit / `ribbit`**. The npm package is `@funsaized/ribbit`.
