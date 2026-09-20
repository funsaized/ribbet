# When to chain models

Ribbit makes a semantic step reusable: give it input, choose a route, inspect its output, and compose it with another step. That is useful when you can give the intermediate result a concrete purpose.

A local classifier can add labels to feedback before a stronger model reviews the original tickets. A summarizer can prepare a short brief for repeated downstream work. An exact file-discovery stage can bound a repository before a model sees any source. These are different jobs with different failure modes.

## Model size, locality, and capability are separate

A stronger model can run on your machine. A small model can be remote. A local route describes where evidence is sent; it does not establish whether an answer is correct. A model that extracts a date reliably may still miss an accessibility issue or produce a wrong grouping.

Choose profiles per command and fixture family. The current [model evaluations](../models.md) include a 0.5B model that returns valid output while failing important filtering and grouping cases. Successful JSON validation cannot detect every factual mistake.

## An intermediate step needs a purpose

Adding a model call adds latency, another opportunity for error, and possibly more text. In the triage recipe, local labels are extra evidence for review; the stronger model still receives all the original bodies. The chain does not claim to reduce context.

Filtering is different. Once it removes a record, a downstream model cannot recover that record from the remaining stream. A successful final answer may still miss an issue that disappeared upstream. If recall matters, retaining originals alongside annotations is easier to audit.

Summarization also loses information. The brief recipe checks that named facts survive, but it cannot promise that every useful detail will fit within the word limit. Keep the source when later review needs it.

## Compare the complete jobs

Evaluate local-only, direct-stronger, and mixed execution on the same inputs and final-task criteria. Count all stages, retries, and repairs. Compare facts preserved and false negatives before comparing speed. Report unknown token usage as unknown.

The current small-fixture experiments do not show an automatic speed, cost, or quality advantage from chaining. A direct stronger-model call can be the simpler choice. Ribbit's contribution is making the route, intermediate data, and boundaries explicit enough to examine that choice.

To run the comparison yourself, use [mixed-model routing](../how-to/route-workflows.md) and the [evaluation guide](../../evals/README.md).
