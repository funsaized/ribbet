# How records and pipes compose

Shell tools agree on bytes. Ribbit commands also need to agree on what those bytes mean: a piece of text, independent JSON values, or records that carry provenance.

## Values and records serve different purposes

A value is the data a command is working on. A record wraps a value with an ID, known source information, and annotations. Classification can add a label without replacing the ticket body. Sorting can move a record without changing its identity. Projection can change its fields while retaining the source reference.

The record header makes that boundary explicit. Auto input recognizes the Ribbit header; it does not assume any JSON-looking text is a record stream. `--input jsonl` deliberately imports one value per line. `--output jsonl` deliberately exports values and drops the record wrapper.

That export is useful when another tool expects ordinary JSON. It is the wrong boundary when a later stage needs annotations or source references. Rendering is similarly a final presentation step, not a lossless record transport.

See [the record reference](../reference/records.md) for the exact wire shape.

## Pipes and flows reuse commands differently

A shell pipeline launches separate processes. Each process resolves its own route, owns its own budgets, and reports its own errors. Your shell determines how the overall pipeline status is calculated.

A Ribbit flow executes named steps in one invocation. Steps share budgets and can refer to earlier typed outputs. Single-use whole outputs can stream where possible; reused outputs and nested references require bounded buffering. There is no hidden parallel DAG scheduler.

The same commands work in both forms, but the resource accounting is not identical. Equal successful output does not imply equal budget behavior. The [flow reference](../reference/flows.md) describes those boundaries.

## Reuse has two levels

A named command saves defaults for an existing type. It is suitable for a summarization policy, classification labels, or a route preference. A typed extension introduces executable behavior and must be built, tested, and trusted.

A flow can use either through the same command contract. This lets a useful one-off invocation become a project definition before it needs any custom code.
