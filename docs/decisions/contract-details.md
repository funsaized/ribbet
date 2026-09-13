# Contract details

The integrator is authorized to resolve routine implementation choices. This decision
preserves the PRD's scope and budgets. Contract acceptance requires executable fixtures;
this file does not itself mark a contract accepted.

- Field paths: dot-separated identifier keys and nonnegative bracket indices, e.g.
  `items[0].title`. Keys containing dots use JSON API objects rather than ambiguous
  selectors. Reject `__proto__`, `prototype`, and `constructor` at any depth.
- Record annotations are required strict JSON objects; source has optional path,
  lineStart and lineEnd. IDs are nonempty strings, unique within a run.
- Wire recognition requires exactly the versioned header structure, not property
  order or JSON whitespace. An object with `$ribbit` but invalid wire metadata fails
  in auto mode; `--input text` treats it literally.
- Exact stream limits: 128 MiB raw bytes, 1,000,000 records by default, independently
  configurable. Semantic limits remain those of the PRD. Global exact sort/unique
  inspect bounded input and do not promise constant memory.
- Flow paths share field grammar; references are whole objects containing only `$ref`.
  A standalone argv token `::` separates segments. Embedded `::` in a larger argument
  remains text. Shell quote characters are not present in argv; quoting the standalone
  token does not escape its separator role.
- Templates substitute `{{field.path}}` against values. No loops, expressions,
  filesystem inclusions or executable expansion. Missing substitutions fail.
- Configuration: `$XDG_CONFIG_HOME/ribbit/config.yaml` or `~/.config/ribbit/config.yaml`
  on both targets. Project configuration uses `.ribbit.yaml`. Built-in names cannot be
  shadowed. Definitions use explicit `project:NAME` and `global:NAME` namespaces.
- Runtime source builds use TypeScript 5.9.3/Zod 4.1.13, then bundled ESM. Exported
  schemas use draft 2020-12. String length/pattern and number integer/range constraints
  are represented in JSON Schema; arbitrary code refinements are rejected.
- Initial release metrics keep every numerical PRD target. Reference runners are
  Linux x86_64 AMD Ryzen 9 5900XT and macOS arm64 Apple M1/16 GiB. Warm p95 uses
  nearest-rank on 30 or more samples after a separately recorded initial invocation.
  Cold-cache results must identify cache control; an initial invocation alone is not
  evidence of cold-cache behavior.
