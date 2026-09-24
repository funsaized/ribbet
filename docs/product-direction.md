# Product direction: an extensible framework for model work

Ribbit is an extensible framework for composing model tasks into reusable commands, with typed contracts and inspectable evidence. It turns messy input into useful, traceable context through composable commands, using an explicitly chosen model at each step.

The first audience is developers working in a shell or through a coding harness. They need to classify noisy feedback, extract structured facts, prepare repository evidence, and reuse transformations without rebuilding input handling, validation, or provider routing every time. A small local model can handle a bounded intermediate task; a stronger model or harness can inspect its output together with the original evidence.

## What makes this useful

The unit of reuse is a command with an inspectable contract. Built-ins and trusted extensions share TypeScript/Zod definitions. A successful invocation can become a named YAML command, then a linear flow. Records carry stable in-run IDs, source references when known, and annotations. Every semantic stage has an explicit route and finite budgets. Exact commands make no inference requests. Contracts validate structure and selected invariants, not truth, and a record keeps evidence traceable without preventing prompt injection.

The initial release shipped 22 commands; the current catalog has 23 with the exact `where` selector. Exact modes have deterministic contracts. Semantic behavior is experimental and model-dependent; individual evaluation results belong in the release checklist, not in a universal “recommended model” claim. The first public alpha is `0.1.0-alpha.1`, with no 1.0 compatibility promise. The owner accepted experimental semantics and authorized publication.

## Three jobs to demonstrate

| Job | Composition | Success criterion |
| --- | --- | --- |
| Prioritize feedback | select → local classify → stronger reduce | All tickets and accessibility issues survive; conclusions cite ticket IDs; all routes are visible |
| Prepare a repository handoff | exact find with content → local relevance annotations → record file → harness | Real paths and complete admitted source text survive; local labels can be challenged by the receiver |
| Reuse a transformation | summarize → named brief → saved brief/rewrite flow | Defaults are inspectable, caller overrides work, and the same definition runs from shell and flow |

Run these with [recipes](recipes.md). Every stage must have a reason to exist. A direct stronger-model request is a required comparison, not an assumption of inferiority. Ordinary tools are sufficient for exact field projection, sorting, and formatting; Ribbit's exact commands are convenient at record boundaries.

## Model selection and information loss

“Small”, “local”, “fast”, “inexpensive”, and “capable” describe different properties. A stronger model can run locally. Local execution keeps evidence on the configured local endpoint but does not establish correctness. Small models can return valid JSON with wrong labels.

Use classification to retain original evidence when recall matters. Filtering irreversibly removes records from that pipeline; the downstream model cannot recover them. The supplied context recipe retains records labeled `other`. It improves inspectability, not necessarily context size or speed. Any future context-reduction claim must measure false negatives and final-task quality, including all upstream overhead.

No confidence score, retry, schema repair, or fluent explanation should be presented as proof of factual correctness. Document observed failure cases and record command/profile suitability separately.

## Scope boundaries

Ship shell pipes, named definitions, linear typed flows, two provider protocols, explicit routes, bounded inference, trusted local extensions, and an inspectable file/stdin harness boundary. No automatic cloud escalation, model downloads, autonomous shell execution by built-ins, marketplace, DAG scheduler, or embedded inference server. Harness tool execution belongs to the explicitly invoked harness and its permissions.

## Release acceptance

Every built-in and management surface needs its own contract/CLI verdict. Every semantic command and optional mode needs live regression evidence, clearly separated from mocked inference and broader quality review. Recipes must agree across supported composition surfaces. Clean installation must succeed without maintainer config. The documentation site builds strictly and repository Markdown links resolve; examples are maintained with the docs but are not automatically executed. License, notices, native platform evidence, and publication decisions must be resolved before distributing a public candidate.

[Product requirements](../Ribbit-PRD.md) expand this direction into the current alpha scope and acceptance criteria. [Release checklist](release-checklist.md) is the current readiness authority. [Individual acceptance](release-acceptance.md) records command coverage and model-specific limits.
