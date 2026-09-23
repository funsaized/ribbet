# Current evaluations

The case catalog in `scripts/release/cases.ts` covers every semantic built-in and optional filesystem/picker semantic mode. These are authored public regression cases with deterministic fact checks, not a held-out or independently reviewed quality benchmark. `tests/release` separately checks packaged contracts against mock HTTP responses and real fzf/PTY interaction on Unix.

The current results are linked from [model evidence](../docs/models.md) and [individual acceptance](../docs/release-acceptance.md). Each report identifies the binary and fixtures actually evaluated; native release CI separately tests the shipping revision. `report.original.json`, where present, is the raw input to the scoring correction recorded in `report.json`, not an additional model run.

## Reproduce

```sh
bun run build
RIBBIT_RUN_LIVE_EVAL=1 bun run eval:release -- --model YOUR_INSTALLED_MODEL --profile evaluation --mode smoke
RIBBIT_RUN_LIVE_EVAL=1 bun run eval:release -- --model YOUR_INSTALLED_MODEL --command filter --mode full --quantization Q4_K_M --max-output-tokens 2048
RIBBIT_RUN_LIVE_EVAL=1 bun run eval:workflows -- YOUR_SMALL_MODEL YOUR_STRONGER_MODEL
RIBBIT_RUN_LIVE_EVAL=1 bun run eval:handoff -- YOUR_LOCAL_MODEL
```

The command runner accepts only a loopback endpoint and copies the executable at run start. Smoke means one repetition of every selected case; full means three. Every attempt must pass its case's deterministic floor; failures cannot be hidden by averaging other commands. Reports include the binary/fixture hash, model/configuration, output, stderr, repair/retry statistics, elapsed time, and raw HTTP requests/responses for every command attempt. Runs are written to timestamped directories. Keep only the latest completed run per model/configuration and workflow on main, including its failed attempts and raw responses; superseded runs remain available in Git history. `--command pick` needs Python 3 and fzf.

The recipe comparison uses both models already loaded in local LM Studio, and records every CLI stage's input, output, errors, statistics, and total wall time. It compares local-only, direct-stronger, and mixed routes using identical source fixtures and final-task floors. Original evidence retention is checked for triage/context; neither recipe performs semantic filtering. Downstream byte counts are evidence size, not billed tokens. Cache state and unrelated workstation load are uncontrolled.

The handoff runner invokes the installed Codex CLI with an isolated CODEX_HOME, no user config, an explicit local provider, read-only sandbox, and a 120-second bound. This tests one source-interpretation task through the real harness, not just a compatible model HTTP endpoint. It does not use cloud credentials or test autonomous coding ability.

The command/model evidence summaries in the current docs are hand-maintained release snapshots. `bun run scripts/release/docs.ts` renders command examples from the executable catalog. Do not alter thresholds or fixture expectations to fit observed model outputs; record fixture/configuration changes as new experiments. See the current [release checklist](../docs/release-checklist.md).
