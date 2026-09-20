# Ribbit 0.1.0-alpha.1

Ribbit's first open-source preview: composable semantic shell commands with typed records, explicit model routing, reusable YAML definitions, linear flows, and trusted TypeScript extensions.

Use a local model for a bounded intermediate task, retain its source evidence, then pass the result to a stronger model or coding harness. The included recipes demonstrate feedback triage, source-context handoff, and reusable transformations. Exact commands work without a model.

## Install

Download the archive matching your OS and CPU from this release, verify its `.sha256` sidecar, and extract it. Keep `ribbit` (or `ribbit.exe`) beside `lib/`. No separate JavaScript runtime is required for ordinary commands. Interactive `pick` requires fzf >=0.74.3.

Native targets: Linux glibc x64/ARM64, macOS Intel/Apple Silicon, and Windows x64/ARM64. The CI matrix builds, tests, packages, and runs isolated archive checks on each target. The Windows interactive console picker is not covered by the POSIX PTY tests; use noninteractive `rank --top` in automation. macOS binaries are ad-hoc signed, not notarized; Windows binaries are not Authenticode signed.

## Evidence and limits

The pre-release Linux baseline passed 165 tests. Recorded local-model regressions passed 57/57 with the stronger profile and 39/57 with the 0.5B model. All 27 recipe comparisons passed their deterministic fact checks, and a real local Codex handoff succeeded. These historical model runs identify their exact binaries; the final native CI separately validates the release build.

This is an alpha, not a broad semantic reliability or API stability promise. Small models can return valid but wrong answers. Chaining did not automatically improve speed or reduce context in these fixtures. Preserve original evidence when downstream review matters. Independent quality review and new-user pilots remain follow-up work.

Licensed under MIT. Model weights are not included. Installed extensions are trusted code, not sandboxed plugins. There is no automatic cloud fallback, telemetry, model download, or npm registry publication.

Documentation: https://github.com/funsaized/ribbet#readme
Security reports: https://github.com/funsaized/ribbet/security/advisories/new
