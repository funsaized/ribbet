# Named command definitions

A named definition reuses an existing command type. It does not contain executable expressions.

| Field | Contract |
| --- | --- |
| `apiVersion` | `ribbit/v1` |
| `kind` | `Command` |
| `name` | Lowercase letter followed by lowercase letters, digits, or hyphens |
| `type` | Scoped built-in or installed type name |
| `typeVersion` | Exact command type version |
| `action` | Action declared by the type |
| `config` | Type configuration object; defaults to `{}` |
| `defaults` | Default action arguments; defaults to `{}` |
| `inference` | Optional inference settings |

See the complete [brief definition](../../examples/commands/brief.yaml). Type versions and product versions are separate: the alpha product includes types with version `1.0.0`, which does not declare the product stable.

Project definitions are discovered in the working directory's `commands/` folder. Global definitions are discovered beside the global configuration. Duplicate names within a scope and built-in names are rejected. Cross-scope collisions require `project:NAME` or `global:NAME`.

Invocation arguments override defaults without modifying the definition. Callers override arguments, not the definition's configuration. Unknown YAML keys, duplicate keys, non-JSON values, excessive aliases, and documents larger than 1 MiB fail validation.

```sh
ribbit commands validate brief --json
ribbit commands describe brief --json
ribbit run brief --words 25 --file meeting.txt --profile local-small
```

Related: [reusable-command tutorial](../tutorials/reusable-command.md), [reuse guide](../how-to/reuse-commands.md), [extension SDK](../extensions.md).
