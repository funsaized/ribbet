# Extensions contract

Status: RATIFIED by implementation integrator, 2026-09-13. Scope and release targets unchanged.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

## 9. Extension authoring contract (R-EXT)

Command types are TypeScript modules built with a supported pinned Zod major and SDK. `defineCommand` declares type (scoped ID), semantic version, description, config schema, and actions. Each action declares description, args schema, input/output schemas, execution mode (value or records), inference capabilities, effects metadata, and execute function. execute receives `{input,args,config}` plus context. Config and args are separate; unknown keys fail. Defaults apply before validation. Built-ins use this same contract.

Public schemas use a JSON-compatible subset: strings, finite numbers, booleans, null, arrays, strict objects, enums, optional/default properties and supported unions. Arbitrary transforms, functions, cycles, custom refinements and non-JSON values are rejected by manifest export unless represented as separately documented runtime checks. Output is validated after execute, including any postprocessing after ctx.llm.object.

CLI generation maps camelCase fields to kebab-case flags; scalar arrays accept repeated flags; complex objects use --args-json. Positional mapping is explicit metadata; no inference of positions. Reserved runtime flag collisions fail extension check. --args-json and field flags cannot both set the same field. A registry-produced manifest drives help, completion, schema discovery, YAML validation and planner inspection without importing extension code. Loading TS to generate that manifest occurs only during explicit check/add/build, because imports can have side effects.

Runtime context includes llm.text, llm.object, log, signal and a shared budget. Text streaming uses an explicit async-iterable execution mode; structured records are validated before emission. llm.object requests native schema support when available and always validates locally. One explicit schema-repair attempt is the default maximum; no silent retry loop. Transport retries are bounded and counted. Validation repair is not a factual correctness guarantee.

Executable extensions are explicitly installed trusted code, with filesystem/network/process effects possible. Effects metadata is descriptive, not enforcement. Project-local files are never executed merely because the user enters a repository or runs help. Builds capture dependency versions, source hash and SDK compatibility. No remote imports/downloads during normal execution. Changed local sources require explicit rebuild/add and invalidate cached manifests. Extension removal cannot delete unrelated user files. An extension invoking its own provider client is outside managed routing guarantees and must disclose that behavior; built-ins must use ctx.llm.

## Ratified shape details

Public command config and each action's args/input/output are separate Zod schemas.
`defineCommand` retains inference of defaults and optional properties, as shown by
[the compile fixture](../../../fixtures/contracts/sdk.ts). This is a signature feasibility
fixture, not an SDK implementation or a promise that only one action exists. Actions
are named maps. Modes are `value`, `records` (AsyncIterable of validated records), and
`text-stream` (AsyncIterable of strings). Results are parsed after execute returns,
and each stream item is parsed before emission. Invalid extension results exit 5;
managed inference validation failures exit 4. TypeScript strict checking is required
at explicit build/check, since runtime type stripping is not type checking.

Manifest envelope: schemaVersion=1, type, version, description, sdkVersion, sourceHash,
dependencies (exact versions), config (JSON Schema), actions (description, args/input/
output JSON Schemas, mode, capabilities, effects, CLI binding metadata). No execute
function or credentials. Hashes are SHA-256 of source/dependency inputs. Check/add
compiles a local source using pinned tooling; install publishes an immutable artifact
within the user's Ribbit data directory using atomic rename. A separate registry
points to installed artifacts. Project sources alone never activate executable code.

Only strict JSON objects and JSON-compatible Zod types are exportable. Transform,
custom refine, lazy cycles, bigint, date, symbol, function, NaN, infinity, catch and
preprocess schemas fail check; integer/minimum/maximum/string length/pattern checks
must export equivalent JSON Schema. Defaults must be JSON values. Unknown keys fail.

Reserved flags include input/output/file/profile/provider/model/force-profile/stats/
error-format/help/version/args-json and all shared budget flags. Positional mappings
are explicit. CamelCase converts to kebab-case; collisions after conversion fail.
Only scalar arrays permit repeated flags; complex values require --args-json. Duplicate
assignment via JSON and flag fails. This rule applies to extensions; built-ins explicitly
own command-specific public flags from the PRD inventory.

Trust metadata is descriptive. Source hashes detect changes, not safety. The runtime
refuses stale sources until explicit rebuild/add. Removal deletes only registry-owned
artifacts after checking ownership; it never removes the source directory. No runtime
network dependency resolution. An extension's independent HTTP client is outside
managed routing and must declare it.
