# Example map

The repository ships three workflows and one reusable command definition. Use the task guide to run an example, or the explanation to understand and adapt its design.

| Example | Run it | Understand it | Source |
| --- | --- | --- | --- |
| Feedback triage | [Triage feedback](how-to/triage-feedback.md) | [Annotation before synthesis](explanation/recipes.md#feedback-triage) | [triage.yaml](../examples/flows/triage.yaml) |
| Repository context | [Prepare a harness handoff](how-to/handoff-context.md) | [Retaining source evidence](explanation/recipes.md#repository-context) | [context.yaml](../examples/flows/context.yaml) |
| Reusable brief | [Build it step by step](tutorials/reusable-command.md) | [Compression and reuse](explanation/recipes.md#reusable-brief) | [command](../examples/commands/brief.yaml), [flow](../examples/flows/brief.yaml) |

The native archive includes `examples/` and `fixtures/`. npm installs the command and its runtime support; get the examples from a [source checkout](https://github.com/funsaized/ribbit) when using npm.

Semantic examples require configured profiles. `local-small` and `stronger` are names you create, not bundled models. Start with [model setup](how-to/configure-models.md).

[Packaged recipe tests](../tests/release/recipes.test.ts) check composition, routes, and evidence boundaries with controlled model responses. [Live model evidence](models.md) reports the separate model runs and their limits.
