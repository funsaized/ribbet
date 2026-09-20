# Command reference

Reference for the 22 built-in commands. Confirm the live surface with `ribbit commands list --json` and per-command flags with `ribbit <command> --help`.

For working invocations and individual assertions, see [command examples](command-examples.md). For model-specific results, see [acceptance](release-acceptance.md).

## ask

Answer an instruction using optional evidence. Input: text; output: text.

- `--instruction`: string (also positional)
- `--rule`: string (repeatable)

## classify

Annotate each original record with one allowed label. Input: records; output: records.

- `--labels`: string
- `--label`: string (repeatable)
- `--field`: string
- `--unknown-label`: string

## compare

Compare exactly two text files without modification. Input: none; output: text.

- `--paths`: string (repeatable) (also positional)
- `--focus`: string

## explain

Explain supplied text, code or errors with explicit uncertainty. Input: text; output: text.

- `--focus`: string (also positional)
- `--audience`: string

## extract

Extract JSON matching a local strict JSON Schema. Input: text; output: json.

- `--instruction`: string (also positional)
- `--schema`: string

## filter

Preserve matching original records in input order. Input: records; output: records.

- `--instruction`: string (also positional)
- `--field`: string

## find

Find real filesystem candidates with optional semantic filtering. Input: none; output: records.

- `--root`: string (also positional)
- `--hidden`: boolean
- `--no-ignore`: boolean
- `--follow`: boolean
- `--outside-root`: boolean
- `--include-sensitive`: boolean
- `--glob`: string
- `--max-files`: integer
- `--on-read-error`: string
- `--kind`: string
- `--about`: string
- `--read`: string

## group

Partition originals into labeled groups exactly once. Input: records; output: records.

- `--instruction`: string (also positional)
- `--field`: string

## ls

List actual filesystem metadata without inference. Input: none; output: records.

- `--root`: string (also positional)
- `--hidden`: boolean
- `--no-ignore`: boolean
- `--follow`: boolean
- `--outside-root`: boolean
- `--include-sensitive`: boolean
- `--glob`: string
- `--max-files`: integer
- `--on-read-error`: string
- `--recursive`: boolean

## map

Transform each record once with origin lineage. Input: records; output: records.

- `--instruction`: string (also positional)
- `--field`: string
- `--schema`: string

## pick

Select original records using fzf on the controlling terminal. Input: records; output: records.

- `--multi`: boolean
- `--query`: string
- `--about`: string
- `--label`: string

## rank

Reorder original records by a semantic criterion. Input: records; output: records.

- `--instruction`: string (also positional)
- `--field`: string
- `--top`: integer

## read

Read explicit UTF-8 files with source boundaries. Input: none; output: records.

- `--paths`: string (repeatable) (also positional)

## reduce

Reduce evidence, optionally in explicit chunks. Input: text; output: text.

- `--instruction`: string (also positional)
- `--strategy`: string
- `--chunk-bytes`: integer

## render

Render text, JSON, JSONL, table or safe substitutions. Input: any; output: display.

- `--as`: string
- `--template`: string

## rewrite

Rewrite text while preserving supplied facts. Input: text; output: text.

- `--instruction`: string (also positional)
- `--rule`: string (repeatable)

## select

Project selected value fields, preserving IDs. Input: records; output: records.

- `--fields`: string (also positional)
- `--missing`: string

## sort

Stable exact sort by a string or numeric field. Input: records; output: records.

- `--by`: string
- `--descending`: boolean
- `--type`: string

## summarize

Summarize within an enforced word maximum. Input: text; output: text.

- `--words`: integer
- `--rule`: string (repeatable)

## take

Take the first N records and stop upstream reads. Input: records; output: records.

- `--count`: integer (also positional)

## tree

Render filesystem topology with optional semantic annotations. Input: none; output: display.

- `--root`: string (also positional)
- `--hidden`: boolean
- `--no-ignore`: boolean
- `--follow`: boolean
- `--outside-root`: boolean
- `--include-sensitive`: boolean
- `--glob`: string
- `--max-files`: integer
- `--on-read-error`: string
- `--depth`: integer
- `--describe`: boolean
- `--about`: string
- `--read`: string

## unique

Keep the first record for each canonical JSON value. Input: records; output: records.

- `--by`: string
