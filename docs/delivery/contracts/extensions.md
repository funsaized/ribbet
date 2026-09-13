# Extensions contract

Status: PROPOSED for implementation planning. The corresponding CONTRACT task must ratify this baseline with evidence; this document does not imply user approval of unpublished details.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

## 9. Extension authoring contract (R-EXT)

Command types are TypeScript modules built with a supported pinned Zod major and SDK. `defineCommand` declares type (scoped ID), semantic version, description, config schema, and actions. Each action declares description, args schema, input/output schemas, execution mode (value or records), inference capabilities, effects metadata, and execute function. execute receives `{input,args,config}` plus context. Config and args are separate; unknown keys fail. Defaults apply before validation. Built-ins use this same contract.

Public schemas use a JSON-compatible subset: strings, finite numbers, booleans, null, arrays, strict objects, enums, optional/default properties and supported unions. Arbitrary transforms, functions, cycles, custom refinements and non-JSON values are rejected by manifest export unless represented as separately documented runtime checks. Output is validated after execute, including any postprocessing after ctx.llm.object.

CLI generation maps camelCase fields to kebab-case flags; scalar arrays accept repeated flags; complex objects use --args-json. Positional mapping is explicit metadata; no inference of positions. Reserved runtime flag collisions fail extension check. --args-json and field flags cannot both set the same field. A registry-produced manifest drives help, completion, schema discovery, YAML validation and planner inspection without importing extension code. Loading TS to generate that manifest occurs only during explicit check/add/build, because imports can have side effects.

Runtime context includes llm.text, llm.object, log, signal and a shared budget. Text streaming uses an explicit async-iterable execution mode; structured records are validated before emission. llm.object requests native schema support when available and always validates locally. One explicit schema-repair attempt is the default maximum; no silent retry loop. Transport retries are bounded and counted. Validation repair is not a factual correctness guarantee.

Executable extensions are explicitly installed trusted code, with filesystem/network/process effects possible. Effects metadata is descriptive, not enforcement. Project-local files are never executed merely because the user enters a repository or runs help. Builds capture dependency versions, source hash and SDK compatibility. No remote imports/downloads during normal execution. Changed local sources require explicit rebuild/add and invalidate cached manifests. Extension removal cannot delete unrelated user files. An extension invoking its own provider client is outside managed routing guarantees and must disclose that behavior; built-ins must use ctx.llm.
