# Typed extensions and named commands

```sh
ribbit extensions scaffold extensions/greeting
ribbit extensions check extensions/greeting
ribbit extensions test extensions/greeting
ribbit extensions add extensions/greeting
ribbit types describe @local/greeting --json
```

Scaffolding creates an ordinary TypeScript command, exact dependency declarations and a fixture. Explicit check/test/add imports trusted source; help, catalog, completion and flow planning only read manifests. Source changes require an explicit rebuild. Registry files and immutable bundles live under `${XDG_DATA_HOME:-$HOME/.local/share}/ribbit/extensions`. Removal preserves source. Build artifacts are checked against their hash before execution. Extensions are trusted code with process/filesystem/network access, not sandboxed plugins.

The adjacent distribution `lib/` is a private `@ribbit/sdk` package. It exports `defineCommand`, `defineAction`, `z`, `recordSchema`, `jsonValueSchema`, `Budget`, `RibbitError` and types. Use strict Zod input, args, config and output schemas. The supported export subset includes primitives, arrays, strict objects, scalar literals/enums, unions, optional/default values and built-in scalar constraints. Transforms, custom refinements, recursive/lazy schemas and arbitrary unknown values are rejected. `jsonValueSchema` explicitly accepts finite JSON.

An action declares description, schemas, mode (`value`, `records`, `text-stream`), input/output kind, effects and capabilities. Record mode receives and returns async iterables. CLI bindings derive from args: scalar fields become kebab-case flags, scalar arrays repeat, complex values use `--args-json`. CLI positionals are explicitly declared in `cli.positionals`. Runtime flag collisions fail generation. Config belongs to the definition; callers override args, not config.

Execution receives `{input,args,config}` and context with `signal`, `budget`, `log`, optional `inputKind` and managed `llm.text(instruction,evidence)` / `llm.object(instruction,evidence,schema)`. Honor cancellation and await calls. Managed calls share route, retry, repair, time and request budgets. Declared effects describe trusted behavior and do not restrict arbitrary TypeScript.

Fixture JSON uses `input`, optional `args`, `config`, `action`, expected JSON `expected` or numeric `error`, and optional ordered mock `responses`. Fixtures are deterministic contract checks, not live provider or quality evidence.

Create `commands/greeting.yaml`:

```yaml
apiVersion: ribbit/v1
kind: Command
name: greeting
type: '@local/greeting'
typeVersion: '1.0.0'
action: run
config:
  prefix: 'Hello '
defaults:
  suffix: '!'
```

Then `printf 'Ada' | ribbit run greeting`. Use `commands validate greeting` and `commands describe greeting --json`. Exact type versions are required. Global definitions live next to global config under `commands/`; project definitions live in project `commands/`. Collisions require `project:NAME` or `global:NAME`; built-in names are reserved. Unknown YAML keys, duplicate keys and executable tags fail.

`ribbit init --agent codex|claude|cursor|opencode` creates project configuration if missing and appends idempotent guidance without replacing existing instructions. The CLI never publishes packages.

The product version and command type versions are separate. The current development product can contain types declared as `1.0.0`; that type identifier is required for definition matching and does not mean Ribbit has shipped a stable 1.0 product.
