# Ribbit

Private, local-first semantic shell toolkit. All 22 command implementations are wired to the CLI, alongside typed extensions, named YAML commands and linear flows. Release acceptance is still in progress; this is a development build.

```sh
npm ci --ignore-scripts
npm run build
printf 'one\ntwo\nthree\n' | ./dist/ribbit take 2 --input lines --output jsonl
./dist/ribbit setup --json
./dist/ribbit ask 'Explain this briefly' --file README.md --profile local-test
```

The distribution contains `ribbit` and its adjacent `lib/` directory. Keep them together for extension authoring. Ordinary commands need no separately installed compiler or runtime. Model inference requires a running provider.

On this workstation, `local-test` points to the user's LM Studio installation at `http://127.0.0.1:1234/v1`, using Qwen2.5-0.5B-Instruct Q4_K_M. This is a fast integration-test model, not an accepted semantic-quality default. The existing Ollama Qwen model is also available through `--profile local-qwen`, without conversion or another download.

- [User guide and examples](docs/usage.md)
- [Generated command reference](docs/commands.md)
- [Extension authoring](docs/extensions.md)
- [Development and validation](docs/development.md)
- [Requirements](Ribbit-PRD.md) and [active backlog](docs/delivery/backlog.md)

No telemetry, automatic cloud fallback, publication or model downloads occur during ordinary command execution. Installed TypeScript extensions are trusted executable code.
