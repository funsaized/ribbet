# Save a command for your project

Use a named YAML definition when you need a reusable instruction, default arguments, or a route preference for an existing command type.

From a checkout or native archive, copy the [brief example](../../examples/commands/brief.yaml) into your project's `commands/` directory. For a guided first attempt, follow [the reusable-command tutorial](../tutorials/reusable-command.md).

```sh
mkdir -p commands
cp examples/commands/brief.yaml commands/brief.yaml
ribbit commands validate brief --json
ribbit commands describe brief --json
ribbit run brief --file fixtures/release/meeting.txt --profile local-small
```

Edit the definition's `defaults` to suit your task. Use the exact type and type version reported by `types describe`; do not infer a command type version from the product's alpha version.

Override one invocation without editing the file:

```sh
ribbit run brief --words 25 --file fixtures/release/meeting.txt --profile local-small
```

Reuse the name as a flow step:

```yaml
- id: summary
  command: brief
```

This is a step fragment, not a complete flow. The [supplied brief flow](../../examples/flows/brief.yaml) is the complete example. Validate any edited flow before running it.

Project definitions live in `commands/`. Global definitions live beside the global configuration in its `commands/` directory. If names collide, use `project:NAME` or `global:NAME`; built-in names are reserved. See [definition reference](../reference/definitions.md).

For new executable behavior, [build an extension](build-extension.md).
