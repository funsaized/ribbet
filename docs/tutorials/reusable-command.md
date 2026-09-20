# Make a reusable brief command

We will save a summarization policy as `brief`, override it for one invocation, and reuse it in a flow.

Prerequisites: an installed `ribbit`, a working `local-small` profile from [model setup](../how-to/configure-models.md), and Bash or Git Bash. Work in a new directory so the example does not replace your own definitions.

## Save the definition

```sh
mkdir -p commands
cat > commands/brief.yaml <<'YAML'
apiVersion: ribbit/v1
kind: Command
name: brief
type: '@ribbit/summarize'
typeVersion: '1.0.0'
action: run
config: {}
defaults:
  words: 40
  rule:
    - Preserve names, dates, amounts, and unresolved questions.
YAML
```

Validate and inspect it:

```sh
ribbit commands validate brief --json
ribbit commands describe brief --json
```

Both commands should succeed without making a model request. The description should identify the summarize type and the 40-word default.

## Run and override it

```sh
printf 'Mina will fix checkout by Friday. The budget is 240 euros. The reviewer is not assigned.\n' > meeting.txt
ribbit run brief --file meeting.txt --profile local-small
ribbit run brief --words 25 --file meeting.txt --profile local-small
```

Each answer must stay within its word limit. Check that Mina, Friday, and 240 euros remain, and that the model has not invented a reviewer. The second invocation changes its limit without editing the YAML file.

## Reuse the command in a flow

```sh
cat > brief-flow.yaml <<'YAML'
apiVersion: ribbit/v1
kind: Flow
name: brief
steps:
  - id: summary
    command: brief
  - id: wording
    command: rewrite
    args:
      instruction: Use plain language; preserve every fact in the summary.
YAML
ribbit flow validate brief-flow.yaml
ribbit flow plan brief-flow.yaml --profile local-small
ribbit flow run brief-flow.yaml --file meeting.txt --profile local-small
```

The plan should show `brief` followed by `rewrite`. Compare the final answer with the named command's output. If rewriting adds no value for your task, keep using `brief` alone.

This is the same pattern used by the supplied [brief definition](../../examples/commands/brief.yaml) and [brief flow](../../examples/flows/brief.yaml). Continue with [saving commands for a project](../how-to/reuse-commands.md) or the [definition reference](../reference/definitions.md).
