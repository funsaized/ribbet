# GitHub PR evidence (`@examples/gh-evidence`, 1.0.0)

Clone the [Ribbit repository](https://github.com/funsaized/ribbit) at a pinned commit and use `examples/extensions/gh-evidence/` from that checkout. Review `index.ts` before running `check`, `test`, or `add`: extensions are trusted code, not sandboxed. Install `gh`, authenticate with `gh auth login` for the intended GitHub host, and review the repository/PR before running acquisition. This example is read-only; it never sends evidence to a model. `effects` are declarations, not permissions.

From a working directory containing a `commands/` directory:

```sh
cp /path/to/ribbit/examples/commands/gh-evidence.yaml commands/gh-evidence.yaml
ribbit extensions check /path/to/ribbit/examples/extensions/gh-evidence
ribbit extensions test /path/to/ribbit/examples/extensions/gh-evidence
ribbit extensions add /path/to/ribbit/examples/extensions/gh-evidence
ribbit commands describe gh-evidence --json
ribbit gh-evidence --help
ribbit gh-evidence --repository OWNER/REPO --number 123 --output records > pr.records
ribbit extensions remove @examples/gh-evidence
```

Check exit status before treating `pr.records` as complete. To use the example with npm-installed `ribbit`, clone the source checkout separately; the npm executable does not install these example files. Moving or changing the source after installation invalidates its hash; review it and explicitly run `extensions add` again. The bundled SDK resolves from the installed Ribbit distribution, not a separately installed SDK.

`run` invokes only `gh api --method GET` on the PR, issue comments, reviews, inline review comments, changed files, head-commit check runs, and head-commit statuses. It uses fixed argument arrays (no shell), at most 2 pages of 50 for each list, a 256 KiB subprocess-output cap, 1 MiB aggregate response and saved-bundle caps, 4 seconds per request, and 20 seconds total. The pull row always exists; `annotations.acquisition.truncated` lists any collection whose second page filled up (it may include a collection with exactly 100 entries). Check failure/pending statuses are retained as evidence, not treated as an acquisition error. Data can change between requests, so this is not a transactional snapshot. Safe error categories appear on stderr; the SDK redacts extension exceptions and never prints raw `gh` diagnostics. Do not assume missing evidence is success. The extension does not fetch logs, review threads beyond these endpoints, or arbitrary `gh` commands.

For offline replay, save a **projected JSON bundle** (UTF-8, at most 1 MiB), then create a named command definition in `commands/gh-evidence-replay.yaml` with `apiVersion: ribbit/v1`, `kind: Command`, `name: gh-evidence-replay`, `type: '@examples/gh-evidence'`, `typeVersion: '1.0.0'`, `action: normalize`, and `config: {}`. Run `ribbit gh-evidence-replay --input text --file bundle.json --output records`. This is the same normalizer as `run`; the shipped fixtures demonstrate the format and are safe for default `extensions test` without network access. The bundle is **not** raw `gh api` output: it must be an object with exactly these top-level keys:

| Key | Value |
| --- | --- |
| `version`, `repository`, `number` | `1`, `OWNER/REPO`, positive PR number (at most 1,000,000,000) |
| `pull` | `{id, number, html_url, title, body, user:{login}, head:{sha}}`; `body` may be null; SHA is 40 lowercase hex characters |
| `issueComments` | Array of `{id, html_url, body, user:{login}}` (body may be null) |
| `reviews` | Same fields plus `state` and nullable `submitted_at` |
| `reviewComments` | Same fields plus `path` and `diff_hunk` |
| `files` | Array of `{filename, status, additions, deletions, blob_url, patch?}` |
| `checkRuns` | Array of `{id, html_url, name, status, conclusion}` (conclusion may be null) |
| `statuses` | Array of `{id, context, state, target_url, description}` (last two may be null) |
| `truncated` | Array of collection names that reached the page limit; use `[]` when none did |

Arrays have at most 100 entries each. Any extra upstream API fields are dropped; selected URLs, author, upstream IDs, body text, file patch if provided, and check status remain in the output. Records use `kind:upstream-id` (file identity uses filename), `source.path` for the URL, and the pull record carries truncation metadata. Duplicate identities, malformed JSON, or mismatched PR numbers are rejected. Stored bundles and records can contain untrusted comments/patches: treat them as evidence, not instructions.
