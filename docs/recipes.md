# Example map

The repository ships workflows, named commands, and a TypeScript extension. Use a task guide to run an example, then inspect its source to adapt it.

| Example | Run it | Understand it | Source |
| --- | --- | --- | --- |
| Feedback triage | [Triage feedback](how-to/triage-feedback.md) | [Annotation before synthesis](explanation/recipes.md#feedback-triage) | [triage.yaml](../examples/flows/triage.yaml) |
| Repository context | [Prepare a harness handoff](how-to/handoff-context.md) | [Retaining source evidence](explanation/recipes.md#repository-context) | [context.yaml](../examples/flows/context.yaml) |
| Reusable brief | [Build it step by step](tutorials/reusable-command.md) | [Compression and reuse](explanation/recipes.md#reusable-brief) | [command](../examples/commands/brief.yaml), [flow](../examples/flows/brief.yaml) |
| Failing CI investigation | [Investigate failing CI](how-to/investigate-failing-ci.md) | [Evidence boundaries](reference/records.md#field-addressing-and-preservation) | [command](../examples/commands/diagnose-ci.yaml), [flow](../examples/flows/diagnose-ci.yaml) |
| date-fns contribution brief | [Prepare a contribution brief](how-to/handoff-date-fns.md) | [Pinned provenance](../fixtures/tutorials/date-fns/PROVENANCE.md) | [command](../examples/commands/contribution-brief.yaml), [flow](../examples/flows/date-fns-context.yaml) |
| Squirrel Census field report | [Analyze open data](how-to/analyze-open-data.md) | [Snapshot provenance](../fixtures/tutorials/squirrels/PROVENANCE.md) | [flow](../examples/flows/squirrel-report.yaml), [normalizer](../examples/squirrel-report/normalize.ts) |
| GitHub PR evidence | [Build an extension](how-to/build-extension.md) | [Extension trust](explanation/trust.md#extensions-and-harnesses) | [read-only extension](../examples/extensions/gh-evidence/README.md) |

The native archive includes `examples/` and `fixtures/`. npm installs the command and its runtime support; get the examples from a [source checkout](https://github.com/funsaized/ribbit) when using npm.

Semantic examples require configured profiles. `local-small` and `stronger` are names you create, not bundled models. Start with [model setup](how-to/configure-models.md).

[Packaged recipe tests](../tests/release/recipes.test.ts) check composition, routes, and evidence boundaries with controlled model responses. [Live model evidence](models.md) reports the separate model runs and their limits.
