# CLI overview

```text
ribbit COMMAND [arguments] [runtime flags]
ribbit run NAME [arguments] [runtime flags]
ribbit flow validate|plan|run FILE [runtime flags]
ribbit flow validate|plan|run [runtime flags] -- COMMAND [args] :: COMMAND [args]
```

`ribbit COMMAND --help` describes the selected command's bindings. Scalar arguments become flags, repeated scalar values repeat the flag, and complex/union argument values use `--args-json`. For example, `ribbit where '$.annotations.classify.label' --args-json '{"equals":"actionable"}'` selects typed equality without coercion. Shell-quote `$` expressions; flow `$ref` bindings are a different syntax. Duplicate or conflicting assignments are errors.

| Shared flag | Purpose |
| --- | --- |
| `--input` | `auto`, `text`, `lines`, `jsonl`, or `records` |
| `--output` | Explicit record, JSONL, text, or JSON boundary where supported by the action |
| `--file PATH` | Read from a file instead of nonempty stdin |
| `--profile NAME` | Select a configured inference profile |
| `--provider NAME`, `--model ID` | Explicit route overrides |
| `--force-profile NAME` | Replace managed routes across a flow |
| `--args-json OBJECT` | Supply complex action arguments |
| `--stats` | Write invocation statistics to stderr |
| `--error-format json` | Write versioned JSON errors to stderr |
| `--max-bytes`, `--max-records` | Bound admitted data |
| `--max-requests`, `--max-tokens` | Bound managed inference usage |
| `--request-ms`, `--total-ms` | Bound request and invocation time |

Command-specific arguments are in the [command catalog](commands.md). Shared contracts are in [records](reference/records.md), [configuration](reference/configuration.md), [flows](reference/flows.md), and [runtime limits](reference/runtime.md). Setup and administration are listed in [management reference](reference/management.md).

Filesystem traversal respects nested `.gitignore` and `.ribbitignore`, excludes hidden names by default, and requires `--follow` to follow symlink directories. Traversal beyond the requested root requires `--outside-root`. Semantic or content discovery excludes common sensitive names unless explicitly admitted with `--include-sensitive`; this is not a secret detector. `--read content` admits text contents. Binary discovery files are skipped with diagnostics, while explicit binary reads fail.

`pick` requires fzf >=0.74.3 and a controlling terminal. Its UI stays on the terminal; stdout contains selected original records. Escape returns 130. Use `rank --top` for noninteractive selection.
