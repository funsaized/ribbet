# Installation and local setup

Download the archive for your machine from [GitHub Releases](https://github.com/funsaized/ribbet/releases). Extract it and keep the executable beside `lib/`. The archives include source, public documentation, MIT and dependency notices, build metadata, and a SHA-256 sidecar.

## Platform support

| OS | Architectures | Executable | Interactive picker |
| --- | --- | --- | --- |
| Linux (glibc) | x64, ARM64 | `ribbit` | fzf >=0.74.3, real PTY tested |
| macOS | Intel x64, Apple Silicon ARM64 | `ribbit` | fzf >=0.74.3, real PTY tested |
| Windows | x64, ARM64 | `ribbit.exe` | fzf >=0.74.3 and attached console; interactive validation is separate from CI |

Each release artifact is built and tested natively in the [CI matrix](https://github.com/funsaized/ribbet/actions). Linux musl/Alpine, FreeBSD, Android, and 32-bit systems are not included in this preview. macOS binaries are ad-hoc signed, not notarized; Windows binaries are unsigned. OS download protection may require explicit approval for this preview. There is no Apple/Microsoft publisher identity claim.

On Windows, extract with `tar -xzf ARCHIVE.tar.gz`, then run `.\ribbit.exe --version` in PowerShell. Use saved flows with `--file` to avoid shell-specific pipeline encoding. The Bash examples also work in Git Bash; native flows avoid shell-specific data encoding. Use `Get-FileHash ARCHIVE.tar.gz -Algorithm SHA256` to compare the checksum. Add the extracted directory to your user PATH if desired.

## Build and install

Install Bun 1.4.0 and npm, then run from the checkout:

```sh
npm ci --ignore-scripts
npm run build
npm run package:smoke
npm run package:release
```

`dist/ribbit` (`dist/ribbit.exe` on Windows) and the adjacent `dist/lib/` form the distribution. Keep them together; `lib/` provides extension authoring dependencies. Ordinary built-in invocations require no additional runtime. Extension authoring smoke tests exercise the bundled SDK/compiler support. Interactive `pick` additionally requires fzf >=0.74.3 and a controlling terminal.

For a user-local installation, copy the distribution to a dedicated directory and symlink the executable:

```sh
mkdir -p "$HOME/.local/opt/ribbit" "$HOME/.local/bin"
cp dist/ribbit "$HOME/.local/opt/ribbit/ribbit"
cp -R dist/lib "$HOME/.local/opt/ribbit/"
ln -sfn "$HOME/.local/opt/ribbit/ribbit" "$HOME/.local/bin/ribbit"
```

Ensure `$HOME/.local/bin` is on PATH. Archive builds include a `.sha256` sidecar; check it with `sha256sum -c` from the archive directory. Checksums establish file integrity, not publisher authenticity. Checksums are supplied alongside the public preview assets; they are not publisher signatures.

To uninstall, remove that symlink and dedicated installation directory. Configuration at `${XDG_CONFIG_HOME:-$HOME/.config}/ribbit` and installed extensions under `${XDG_DATA_HOME:-$HOME/.local/share}/ribbit` are separate user data; preserve or remove them deliberately.

## Configure installed models

Start your local LM Studio or Ollama server yourself. Ribbit detects endpoints but does not install models or alter configuration during setup.

```sh
ribbit setup --json
ribbit providers add local --type openai-compatible \
  --base-url http://127.0.0.1:1234/v1 \
  --capabilities text,stream,object,temperature,maxOutputTokens
ribbit models list --provider local
```

Choose exact model identifiers from the returned list. Replace these placeholder values before running:

```sh
ribbit profiles set local-small --provider local --model YOUR_SMALL_MODEL --max-output-tokens 2048
ribbit profiles set stronger --provider local --model YOUR_STRONGER_MODEL --max-output-tokens 2048
ribbit route inspect ask --profile local-small --json
ribbit doctor --probe --json
printf 'Mina owns the fix.' | ribbit ask 'Who owns the fix?' --profile local-small
```

For native Ollama, use provider type `ollama` and base URL `http://127.0.0.1:11434`. OpenAI-compatible means the tested protocol subset, not universal vendor compatibility. Remote endpoints are explicit opt-ins. Use `--api-key-env VARIABLE_NAME` to reference a credential; never put a key in a command example or endpoint URL.

There is no workstation-specific default. Pass `--profile`, or set `default: {profile: local-small}` in the global config described in [usage](usage.md). The named brief recipe uses that default unless you supply a flow profile. Models that think internally may need more output tokens even for short visible answers; see [model evidence](models.md).

## Troubleshooting

| Symptom | Next check |
| --- | --- |
| Exit 3 / no route | Inspect the route; confirm the named profile and exact model ID exist |
| Connection failure | Start the provider and run doctor with `--probe` |
| Exit 4 / truncated output | Inspect stats; verify model/provider capabilities and output-token allowance; do not accept partial output as success |
| Requires records | Use `--input lines`, `--input jsonl`, or a Ribbit record-producing command |
| Lost classification labels | Keep record output; bare JSONL/render deliberately drops annotations |
| Exit 6 | Reduce admitted input or explicitly increase finite limits after checking resources |
| pick fails in automation | Use rank/take; pick requires a TTY and supported fzf |
| Extension missing or stale | Run explicit check/test/add; keep the distribution's adjacent lib directory |

Use shell `set -o pipefail` when any failed stage must fail the pipeline. Streaming commands may have emitted a valid prefix before a later error.
