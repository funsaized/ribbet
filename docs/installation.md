# Installation and local setup

Download the archive for your machine from [GitHub Releases](https://github.com/funsaized/ribbit/releases). Extract it and keep the executable beside `lib/`. The archives include source, public documentation, MIT and dependency notices, build metadata, and a SHA-256 sidecar.

## Install with npm

```sh
npm install -g @funsaized/ribbit@alpha
ribbit --version
```

Requires Node.js >=20 and tar. The [npm package](https://www.npmjs.com/package/@funsaized/ribbit) downloads the matching native archive from the versioned GitHub release and verifies the archive and executable hashes pinned in the package. It installs only the executable and adjacent extension support files. With lifecycle scripts disabled, the first invocation performs installation instead. This downloads Ribbit, not model weights.

Use `npm uninstall -g @funsaized/ribbit` to remove the npm installation. User configuration and installed extensions are preserved. For offline use or a machine without Node.js, use the native archive. A failed download or checksum check stops installation; `npm rebuild -g @funsaized/ribbit` retries it.

## Platform support

| OS | Architectures | Executable | Interactive picker |
| --- | --- | --- | --- |
| Linux (glibc) | x64, ARM64 | `ribbit` | fzf >=0.74.3, real PTY tested |
| macOS | Intel x64, Apple Silicon ARM64 | `ribbit` | fzf >=0.74.3, real PTY tested |
| Windows | x64, ARM64 | `ribbit.exe` | fzf >=0.74.3 and attached console; interactive validation is separate from CI |

Each release artifact is built and tested natively in the [CI matrix](https://github.com/funsaized/ribbit/actions). Linux musl/Alpine, FreeBSD, Android, and 32-bit systems are not included in this preview. macOS binaries are ad-hoc signed, not notarized; Windows binaries are unsigned. OS download protection may require explicit approval for this preview. There is no Apple/Microsoft publisher identity claim.

On Windows, extract with `tar -xzf ARCHIVE.tar.gz`, then run `.\ribbit.exe --version` in PowerShell. Use saved flows with `--file` to avoid shell-specific pipeline encoding. The Bash examples also work in Git Bash; native flows avoid shell-specific data encoding. Use `Get-FileHash ARCHIVE.tar.gz -Algorithm SHA256` to compare the checksum. Add the extracted directory to your user PATH if desired.

## Build and install

Install Bun 1.4.0, then run from the checkout:

```sh
bun install --frozen-lockfile --ignore-scripts
bun run build
bun run package:smoke
bun run package:release
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

## Continue

Run [your first pipeline](tutorials/first-pipeline.md) without a model, then [configure existing local models](how-to/configure-models.md) for semantic commands. Use [troubleshooting](how-to/troubleshoot.md) if an invocation fails.
