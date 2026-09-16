# Ribbit

Private, local-first semantic shell toolkit. All 22 command implementations are wired to the CLI, alongside typed extensions, named YAML commands and linear flows. Release acceptance is still in progress; this is a development build.

```sh
npm ci --ignore-scripts
npm run build
printf 'one\ntwo\nthree\n' | ./dist/ribbit take 2 --input lines --output jsonl
./dist/ribbit setup --json
./dist/ribbit ask 'Explain this briefly' --file README.md --profile local-gemma
```

The distribution contains `ribbit` and its adjacent `lib/` directory. Keep them together for extension authoring. Ordinary commands need no separately installed compiler or runtime. Model inference requires a running provider.

On this workstation the default profile is `local-gemma` (LM Studio at `http://127.0.0.1:1234/v1`, model `gemma-4-e4b`), the selected v1 model; see [model selection](docs/models.md). `--profile local-test` uses the smaller Qwen2.5-0.5B for fast integration checks and did not pass the semantic quality gates; `--profile local-qwen` reuses the existing Ollama Qwen3.5:9b, which failed the filter gate. The local server must be running (LM Studio → Developer → Start Server); verify the route with `ribbit doctor --probe --json`.

- [Delivery state and remaining gates](docs/delivery/backlog.md)
- [User guide and examples](docs/usage.md)
- [Command reference](docs/commands.md)
- [Extension authoring](docs/extensions.md)
- [Development and validation](docs/development.md)
- [Product requirements](Ribbit-PRD.md)

No telemetry, automatic cloud fallback, publication or model downloads occur during ordinary command execution. Installed TypeScript extensions are trusted executable code.
