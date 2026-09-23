# Development

Install the pinned dependencies with `bun install --frozen-lockfile --ignore-scripts`. Project builds and tests run with Bun 1.4.0, for example `bun run build`; run `dist/ribbit --help` (`dist/ribbit.exe` on Windows). Node.js >=20 and npm are only needed for npm distribution checks and publishing. The verification gate also requires Python 3 and fzf >=0.74.3.

Package boundaries: `src/sdk` is the public contract, `src/engine` handles records and execution, `src/cli` handles parsing and shell I/O, `src/providers` manages HTTP, and `src/builtins` implements commands.

| Script | Purpose |
| --- | --- |
| verify | Install from `bun.lock` and run the complete deterministic gate |
| check | Strict TypeScript check |
| lint / lint:fix | Check or fix lint issues with Oxlint |
| format / format:check | Format or check formatting with Oxfmt |
| test:unit | Unit and deterministic integration checks |
| test:consumer | Public SDK consumer checks |
| test:cli | CLI subprocess checks |
| test:conformance | Adversarial paths and real loopback HTTP cancellation |
| test:release | Individual commands, management lifecycle, and composed recipes against the built executable |
| test:docs | Repository Markdown link targets |
| build | Compile the native CLI and extension support files |
| bench | Local startup timing; writes ignored benchmark output |
| eval:release | Opt-in local per-command model regressions |
| eval:workflows | Opt-in local-only, stronger-only, and mixed-model comparisons |
| eval:handoff | Opt-in real local harness handoff |
| package:smoke | Isolated installed CLI and extension-authoring smoke |
| package:release | Create the native archive, metadata, and checksum |
| package:verify | Verify checksum and test the extracted installation |
| package:npm | Stage and pack the npm installer from all six verified archives |
| package:npm:verify | Check npm packaging, installation, checksum rejection, and command mapping |

The [CI workflow](../.github/workflows/ci.yml) runs without model credentials on Linux, macOS, and Windows, each on x64 and ARM64. It uploads archives only after native tests and isolated installation checks pass. Windows skips the POSIX permissions and PTY-specific tests; interactive Windows console behavior is not certified by those checks.

Lint and formatting use `.oxlintrc.json` and `.oxfmtrc.json`. Generated output and evaluation recordings are excluded. Run `bun run verify` before review and `bun run package:release && bun run package:verify` when changing distribution behavior.

See the [evaluation guide](../evals/README.md) for live opt-in runs, [individual acceptance](release-acceptance.md) for coverage, and the [release checklist](release-checklist.md) for the current release decision.

## Publish the npm distribution

The repository package stays private. After native CI passes, collect all six archives and checksums from the same commit. Run `bun run package:npm -- @funsaized/ribbit PATH_TO_ARTIFACTS` to generate `dist/npm` and its tarball in `dist/releases`. The generated manifest pins each archive and binary checksum. Publish the native GitHub release before npm so installation URLs are available, then publish the reviewed tarball with `npm publish PATH_TO_TARBALL --access public --tag alpha`. Attach the npm tarball and its checksum to the GitHub release and link the registry package in release notes. Publishing requires the authorized npm account; it is not part of ordinary CI.

## Documentation

The [documentation hub](index.md) uses [Diátaxis](https://diataxis.fr/) to separate tutorials, task guides, reference, and explanation. A tutorial should be a complete lesson with visible checkpoints. A how-to guide should solve a specific task. Reference describes the current contract; explanation gives the reasoning and tradeoffs. Link between these forms instead of making every page serve all four purposes.

Preview the searchable site locally:

```sh
python3 -m venv .venv-docs
.venv-docs/bin/pip install -r requirements-docs.txt
.venv-docs/bin/mkdocs serve
```

On Windows, use `.venv-docs\Scripts\python -m pip` and `.venv-docs\Scripts\python -m mkdocs`. Build with `mkdocs build --strict` in the environment. The documentation workflow checks the site and deploys the main branch to [GitHub Pages](https://funsaized.github.io/ribbit/).

`bun run test:docs` checks repository Markdown link targets. Build the published site with `mkdocs build --strict`. External repository links are rewritten for the site by `scripts/docs-hooks.py`; the original Markdown links still work in GitHub and the release archive.
