# Using Ribbit

## Input and output

`--input auto` preserves ordinary stdin as text; it recognizes only the versioned Ribbit record header. Use `--input lines` for one string record per line or `--input jsonl` for one JSON value per line. `--input records` requires the wire header. Invalid UTF-8, malformed records, duplicate IDs and exceeded limits fail explicitly.

Record commands emit Ribbit records by default. `--output jsonl` intentionally drops IDs, source metadata and annotations. `render` is the final display boundary. JSON emitted by `extract` needs `render --input jsonl` when passed through a shell pipe; ordinary JSON is never silently inferred by the auto adapter.

```sh
printf '{"name":"Ada","score":2}\n{"name":"Lin","score":1}\n' | ribbit sort --by score --type number --input jsonl | ribbit select name | ribbit render --as table
printf 'one\ntwo\n' | ribbit take 0 --input lines
```

`--file PATH` and nonempty stdin are mutually exclusive. `read`, `compare` and filesystem traversal own their explicit paths and reject piped input. stdout carries data; stderr carries errors and `--stats`. Exits: 0 success (including downstream pipe closure), 2 invalid arguments/input, 3 route/provider/configuration, 4 invalid semantic result, 5 extension execution, 6 budget, 7 filesystem/terminal/output, 130 cancellation. `--error-format json` produces a versioned diagnostic object.

## Providers

Start LM Studio's local API server on loopback, or use an existing Ollama service. Setup probes both services without installing or downloading anything.

```sh
ribbit setup --json
ribbit providers add lmstudio --type openai-compatible --base-url http://127.0.0.1:1234/v1 --default-model qwen2.5-0.5b-instruct --capabilities text,stream,object,temperature,maxOutputTokens
ribbit profiles set local-test --provider lmstudio --model qwen2.5-0.5b-instruct --max-output-tokens 256
ribbit models list --provider lmstudio
ribbit route inspect ask --profile local-test --json
ribbit doctor --probe --json
```

Global configuration is `${XDG_CONFIG_HOME:-$HOME/.config}/ribbit/config.yaml` on both Linux and macOS. It contains `schemaVersion: 1`, `providers`, `profiles`, `default` and per-command `routes`. Set `default: {profile: local-gemma}` for a global default. A project `.ribbit.yaml` contains `apiVersion: ribbit/v1` and optional `inference: {profile: local-gemma}`. Project inference overrides the global default. Explicit command, definition, step and CLI overrides remain stronger. Credentials are environment-variable references (`--api-key-env NAME`), never literal keys. A `.env` file in the project root is loaded at startup so those references resolve without exporting them by hand; real environment variables take precedence over the file, and a missing `.env` is not an error. `.env` files are git-ignored and excluded from semantic filesystem reads. There is no automatic fallback.

On this workstation the default profile is `local-gemma`, the selected v1 model (see [models](models.md)); `--profile local-test` uses the smaller Qwen2.5 0.5B, which failed the quality gates, and `--profile local-qwen` reuses the existing Ollama Qwen3.5:9b, which passed transport checks but not the filter gate.

### Reasoning

Thinking is wasted work for schema-constrained commands (`classify`, `filter`, `extract`, `rank`, `group`) and can exhaust the output budget, producing truncation failures. A provider declares the `reasoning` capability only when its adapter can control thinking; structured requests then default to `reasoning: off`, while free text keeps the model default. Set `reasoning: off|on` in a profile, route or project to override. Resolution fails if a route sets `reasoning` on a provider without the capability. Ollama uses the native `think` field; OpenAI-compatible adapters send `chat_template_kwargs.enable_thinking` and must be declared explicitly because template support varies. A thinking model on a provider without the capability needs a larger `--max-output-tokens`, not silence.

A shell pipeline runs separate commands with separate budgets and routes. In a flow, `--profile`/`--provider`/`--model` supply flow invocation defaults; segment overrides win. `--force-profile` replaces managed inference routes across a flow and is visible in its plan.

## Flows

```sh
printf '{"name":"Ada"}\n' | ribbit flow run --input jsonl --output jsonl -- select name :: take 1
ribbit flow plan fixtures/flows/exact.yaml
```

Saved flows use `apiVersion: ribbit/v1`, `kind: Flow`, `name`, optional input JSON Schema and inference, a nonempty `steps` array and optional `output`. Each step has unique `id`, `command`, `args`, optional `input` and `inference`. Default input is the previous output, or flow input for the first step. References use `{$ref: input}` or `{$ref: steps.first.output.title}`; numeric array indices use `[0]`. Keys use letters, digits, underscores and hyphens, beginning with a letter or underscore. Prototype-related keys, future references, interpolation and executable expressions are rejected.

References retain JSON types. Single-use whole outputs stream when possible; reused outputs and nested paths buffer within the shared budget. Unknown schemas defer validation to runtime. Planning reads declarations without importing extensions or contacting models. A literal standalone `::` argv token is reserved as an inline separator; shell quotes cannot distinguish that token after shell parsing. A longer quoted prompt containing `::` remains intact.

## Files and interactive selection

Traversal respects nested `.gitignore` and `.ribbitignore`, excludes hidden names by default, and does not follow symlink directories without `--follow`. `--outside-root` is required for traversal beyond the requested root. Semantic discovery excludes common sensitive names unless `--include-sensitive`; this is not a secret detector. `--read content` explicitly includes file contents as model evidence. Binary discovery files are skipped with diagnostics; explicit binary reads fail.

`tree --describe` labels names-only versus content evidence. Generated IDs must match actual candidates. `pick` requires a controlling TTY and fzf >=0.74.3; its UI stays on that terminal and stdout contains only selected originals. Escape returns 130. Noninteractive automation can use `rank --top`.

## Limits

Semantic defaults: 8 MiB, 10,000 records, 200 candidates for rank/group, 100 inspected filesystem entries, 60 seconds/request and 120 seconds total, 32 requests and 64,000 tokens. Exact input defaults: 128 MiB and 1,000,000 records. `--max-bytes`, `--max-records`, `--max-requests`, `--max-tokens`, `--request-ms` and `--total-ms` override finite limits. Flow outputs share cumulative accounting. Provider context limits may be tighter. Structured repair is bounded to one repair and shares all budgets. Missing usage is reported as unknown.
