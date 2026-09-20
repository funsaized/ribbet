# Development

Install pinned dependencies with `npm ci --ignore-scripts`. Build with Bun 1.4.0
using `npm run build`; run `dist/ribbit --help`. Development tooling uses TypeScript
5.9.3. Production builds must use the same Bun version on both targets.

Package boundaries: src/sdk (public contract), src/engine (records and execution),
src/cli (parsing and shell I/O), src/providers (managed HTTP), src/builtins (commands).
The CI workflow runs deterministic checks without model credentials and uploads verified platform archives as CI artifacts; GitHub Release publication is a separate authorized action. Run `npm run verify` locally; it also requires Python 3 and fzf >=0.74.3.

| Script | Purpose |
| --- | --- |
| check | Strict TypeScript check |
| lint | Oxlint with the repository config (`.oxlintrc.json`) |
| lint:fix | Apply safe oxlint fixes |
| format | Format with oxfmt (`.oxfmtrc.json`) |
| format:check | List files that are not yet formatted |
| test:unit | Unit and deterministic integration checks |
| test:consumer | Public SDK consumer checks |
| test:cli | Subprocess shell checks |
| test:conformance | Loopback HTTP cancellation checks |
| test:docs | Links and packaged deterministic examples |
| build | Compile native development CLI |
| bench | Warm-process timing; remaining gates tracked separately |
| eval:semantic | Three-repetition local semantic evaluation; explicit opt-in |
| eval:rubrics | Five-family rubric run through the local profile; explicit opt-in |
| eval:gate | Combine a rubric run and reviewer verdicts into the gate report |
| eval:agent | AGENT-03 runner; repository placeholder that exits nonzero |
| package:smoke | Isolated installed CLI and extension-authoring smoke |

The consumer suite checks the public SDK; the conformance suite currently checks real loopback HTTP cancellation and needs local socket permission. Neither represents full release conformance. The current binary exposes all 22 commands. See the backlog for acceptance status; implementation is not a release-quality claim.

Formatting and linting use the Oxc toolchain: `oxlint` and `oxfmt`, configured by `.oxlintrc.json` and `.oxfmtrc.json`. Both honor `.gitignore`; the configs additionally exclude generated and recorded data (`dist`, `src/generated`, `evals/datasets`, `evals/results`, `evals/agent`, `evals/review`, `benchmarks`, `fixtures`, `spikes`). `npm run lint` passes with no errors (warnings are advisory). Run `npm run format:check` before review; format only changed files when possible.

Live provider harness: `scripts/live-provider.ts`; configuration and bounded invocation
are documented in [evaluation guide](../evals/README.md).

Release acceptance tests: `npm run test:release` (build first). Live per-command regression: `npm run eval:release -- --help`. Review artifact: `npm run package:release`. See [release checklist](release-checklist.md) for current evidence.
