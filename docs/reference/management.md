# Management commands

| Surface | Purpose | Inspection example |
| --- | --- | --- |
| `setup` | Discover local service endpoints without model installation | `ribbit setup --json` |
| `doctor` | Diagnose configuration, picker, extensions, and explicit provider probes | `ribbit doctor --json` |
| `providers` | Add, list, and remove endpoint configurations | `ribbit providers list --json` |
| `models` | List models from an explicitly selected provider | `ribbit models list --provider local` |
| `profiles` | Set, inspect, list, and remove named inference settings | `ribbit profiles list --json` |
| `route` | Inspect the route for a command | `ribbit route inspect ask --profile local-small --json` |
| `commands` | List and describe commands; validate named definitions | `ribbit commands list --json` |
| `types` | Inspect built-in and installed type contracts | `ribbit types describe @ribbit/summarize --json` |
| `extensions` | Scaffold, check, test, add, list, and remove trusted extensions | `ribbit extensions list --json` |
| `run` | Invoke a named command with argument overrides | `ribbit run brief --file meeting.txt --profile local-small` |
| `flow` | Validate, plan, or run saved and inline flows | `ribbit flow plan examples/flows/triage.yaml` |
| `init` | Create project config and optionally append agent guidance | `ribbit init --agent codex` |
| `completions` | Emit Bash, Zsh, or Fish completions | `ribbit completions bash` |

Examples that refer to a profile, definition, or file require it to exist. `models list` and `doctor --probe` perform explicit network requests. Catalog/help/completion/flow planning inspect declarations without importing installed extension code.

`init --agent` supports `codex`, `claude`, `cursor`, and `opencode`. Initialization preserves existing unrelated guidance and does not replace an existing project config. Generated completions include named definitions.

See [model setup](../how-to/configure-models.md), [extension authoring](../how-to/build-extension.md), and [named definitions](definitions.md) for task-specific instructions.
