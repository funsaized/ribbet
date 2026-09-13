# Flows Filesystem contract

Status: RATIFIED baseline, 2026-09-13. See the corresponding CONTRACT evidence. Downstream implementation and release gates require their own acceptance.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

## 10. YAML definitions and flows (R-FLOW)

Command definition fields: apiVersion ribbit/v1, kind Command, name, type, typeVersion (exact), action, config, defaults (action args), inference. Resolve only installed types. Duplicate names fail rather than shadow built-ins. Runtime flags may override invocation args; config remains definition-owned. Project definitions can override global definitions only through explicit documented namespacing, not silent precedence.

Example definition:

```yaml
apiVersion: ribbit/v1
kind: Command
name: commit
type: '@local/commit-message'
typeVersion: '1.0.0'
action: run
config:
  style: conventional
defaults:
  scope: cli
inference:
  profile: local-fast
```

Flow fields: apiVersion, kind Flow, name, input JSON Schema, inference default, steps, output. Each step has unique id, command, args, input binding, optional inference. References are objects `{$ref: input}` or `{$ref: steps.ID.output[.field]}`; object keys/array indices use a documented restricted path syntax. No CEL, JavaScript, arithmetic, implicit string interpolation, future references, nested flows, or cycles in v1. Values preserve types. Unknown fields/paths fail. Obvious schema mismatches fail preflight; runtime validation remains authoritative. Repeated --rule is an additive instruction within a single inference action; arbitrary steps are never automatically fused.

Inline flows use literal `::` tokens, with command segment arguments parsed independently. Top-level input and budget options precede the first segment. Each segment uses the same command parser; quoted `::` inside a prompt remains part of that argument, while a standalone separator is reserved. Flow plan performs no inference and displays routes, input bindings, streaming/barrier boundaries, limits and declared effects. It is not a prediction of LLM-generated output or arbitrary TS behavior.


## 12. Filesystem and interactive behavior (R-FS)

Root traversal observes .gitignore and Ribbit ignore rules by default; hidden files excluded unless --hidden, ignored files included only with --no-ignore. Default sensitive-name exclusions cover .env variants, credential key files and VCS internal content for semantic reads; explicit inclusion is required and visible in the plan. This is a convenience filter, not proof of secret detection. Explicit read paths are intentional inputs and do not get silently dropped. Symlink directories are not traversed by default; --follow detects cycles and retains the requested root boundary unless --outside-root is explicit. Binary files are skipped in discovery content reads with a diagnostic; explicit read of binary input errors.

ls/find emit actual metadata. find first applies cheap exact predicates, then semantic decisions on names unless --read content is explicit. tree --describe defaults to names evidence, labels descriptions accordingly, and supports --read content for richer evidence. Budgets: configurable maximum files and input bytes; omit nothing silently. Discovery budget exhaustion errors before semantic inference. No model output may introduce a path not present in candidates. Traversal errors are reported; --on-read-error skip is an explicit discovery-only option producing warnings and omission counts.

pick v1 uses an installed fzf-compatible backend with a pinned supported minimum determined in the runtime spike. Invocation passes argv without shell interpolation. Opaque IDs map display labels back to originals; tabs, newlines, ANSI sequences and hostile labels cannot inject arguments or corrupt identity. --about performs a bounded semantic rank once, then the picker operates lexically. Cancel returns 130 and no selections. A TTY is required; absent backend returns an actionable error. Backend output is never trusted to create arbitrary records.

## Implemented reference details, 2026-09-13

Restricted field components are `.key` (ASCII letter or underscore first, then letters, digits, underscore or hyphen) and `[nonnegativeDecimalIndex]`. Prototype-related keys are forbidden. Missing known schema paths fail planning; unknown schemas defer to runtime. Direct single-consumer references can stream; reused or field-selected outputs materialize within shared limits. Templates use `{{field.path[0]}}` only; values substitute literally without evaluation. Table rendering escapes control characters.

Standalone `::` is reserved at the argv layer. A shell removes quote information, so a quoted argument equal to `::` cannot be distinguished from a separator; longer prompt arguments containing `::` remain intact. Use saved YAML for that exact literal payload. This resolves the original phrasing without introducing a shell parser.

Filesystem scenario checks cover nested ignores, hidden/sensitive names, binary contents, symlink cycles and finite discovery budgets. Real fzf PTY smoke covers a label containing tabs, newline, ANSI and shell-looking text, exact original selection, and Escape cancellation with exit 130. No fixture interprets model output as a path.
