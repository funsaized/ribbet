# Prompt: prepare Ribbit's first open-source release

You are working in the Ribbit repository as a product-minded engineer and release reviewer. Analyze the existing implementation, sharpen its product direction, test every command individually, fix release-critical gaps, and prepare a concrete, reviewable first open-source release candidate. Carry out the work; do not stop at a roadmap or documentation rewrite. Publication itself is a separate owner action.

## Product intent

Ribbit should let people compose small, predictable operations around models: use deterministic tools and small or local models for bounded work, preserve useful evidence and structured intermediate results, and explicitly pass those results to stronger models or an external agent harness when needed. Humans can use pipes; agents can discover contracts and compose the same operations. Users should be able to reuse a successful command as a named definition or typed extension.

The central promise to investigate and demonstrate is:

**Turn messy input into useful, traceable context through composable commands, using the appropriate model at each step.**

Small models are fallible workers. Schema validation does not make their answers correct. A larger downstream model cannot recover evidence that an upstream filter discarded. Demonstrate when decomposition improves the final result, latency, privacy, or stronger-model context consumption, and state when it does not. Stronger models may also run locally. Distinguish small, local, fast, inexpensive, and capable; these are different properties.

Keep the existing foundations unless evidence identifies a concrete defect: TypeScript/Zod contracts, record identity and lineage, ordinary shell composition, named YAML commands, linear flows, explicit route overrides, bounded inference, and trusted local extensions. Do not expand into an autonomous agent platform, arbitrary DAG engine, or automatic cloud fallback. Explicitly configured mixed-model stages and external harness handoffs can establish the product without adding those systems.

## 1. Establish the actual state

Read applicable repository instructions, then inspect:

- `README.md`, `Ribbit-PRD.md`, `docs/usage.md`, `docs/commands.md`, `docs/extensions.md`, `docs/models.md`, and `docs/development.md`.
- `src/builtins/`, `src/sdk/`, `src/engine/`, `src/cli/`, `src/routing/`, `src/providers/`, `src/flows/`, and extension/definition discovery.
- Tests, evaluation runners and fixtures, package/build/smoke scripts, the delivery backlog, and launch evidence.

Build a concise architecture map and an evidence-based gap list. Distinguish implemented, contract-tested, subprocess-tested, live-provider-tested, semantically evaluated, and documented behavior. Historical ACCEPTED labels and stored scores are evidence to verify, not current acceptance by themselves. Identify the exact revision and environment for new results. Preserve unrelated work and never expose `.env` contents or credentials.

Starting observations to verify rather than assume:

- There are 22 built-ins, explicit routing, typed linear flows, and a packaged SDK.
- Core semantic evaluations cover filter/classify/extract; rubric evaluations cover rank/group/reduce/compare/explain. Other semantic commands and optional semantic modes need explicit quality evidence.
- Several family tests use canned responses. These establish contracts, not whether the requested task is performed well.
- `scripts/docs-examples.ts` exercises a small set of deterministic examples; it does not validate the full public guide.
- Existing datasets are synthetic and share template families across their development and held-out splits.
- The README includes workstation-specific model defaults. Product and delivery documents contain different snapshots of readiness.
- The package is private and development-versioned; public licensing, contributor materials, hosted CI, and distribution readiness need inspection.

Run the relevant existing baseline before changing behavior. Report failures accurately, including environmental restrictions. Never overwrite historical evaluation evidence with new results lacking provenance.

## 2. Make the release direction explicit

Write one authoritative product-direction document, and reconcile the README and PRD with it. Cover the primary user, problem, concise promise, three concrete jobs, differentiators, non-goals, and measurable acceptance criteria. Preserve historical delivery records as dated history rather than competing current guidance.

Lead onboarding with a working result, then explain records, model routing, composition, and extension authoring progressively. Choose three flagship workflows:

1. Messy feedback or logs → deterministic preparation → local classification/extraction → stronger-model synthesis or prioritization.
2. Repository discovery → bounded local relevance assessment → source-preserving context package → external coding harness.
3. A useful single command → reusable named YAML command → saved flow, with a typed extension only where additional executable logic is needed.

For each, explain the user's outcome, why each step exists, the information passed between steps, where inference occurs, and why that route is appropriate. Describe when ordinary shell tools or one direct strong-model request are simpler. Do not make unsupported competitor, cost, speed, or quality claims.

Review the full 22-command scope for coherence. Keep the commands unless the owner explicitly approves a scope change; recommend experimental status or deferral with evidence when necessary. An initial open-source release need not imply a 1.0 stability promise.

## 3. Accept every command individually

Create a command acceptance matrix for:

`ask`, `summarize`, `explain`, `rewrite`, `extract`, `classify`, `filter`, `rank`, `group`, `map`, `reduce`, `compare`, `ls`, `find`, `tree`, `pick`, `read`, `select`, `sort`, `unique`, `take`, and `render`.

Give each command a user job, exact invocation, input/output contract, meaningful fixtures, asserted success behavior, relevant edge/failure behavior, documentation example, evidence path, and explicit status. Separate deterministic and semantic modes of find/tree/pick. Audit management commands separately, including setup, doctor, providers, models, profiles, route, commands, types, extensions, run, flow, init, and completions.

Use three distinct evidence layers:

1. Deterministic contract tests: schema validation, identities, cardinality, ordering, provenance, limits, and zero-inference behavior where promised.
2. Actual CLI subprocess tests: argument parsing, input adapters, stdout/stderr, exits, piping, cancellation, early downstream closure, and packaged behavior. Cover each built-in with a real useful invocation. Use mock HTTP providers where repeatability matters; label those tests as mocked inference.
3. Live semantic evaluations: whether a model actually accomplishes each semantic job. Cover all semantic commands and optional modes, not just shared helpers. Make runs selectable by command and profile, with bounded smoke and full evaluation modes.

Choose relevant cases rather than duplicating a huge generic matrix for every command. Important invariants include original-record preservation; rank permutation before slicing; group complete partition; exactly one mapped result with lineage; missing-fact extraction; rewrite factual preservation; summary word limits and factuality; audience-appropriate explanations; comparison source separation; chunked-reduction omissions; real filesystem paths; ignore/symlink/sensitive-file behavior; picker TTY/cancellation behavior; safe rendering; and take's upstream stopping behavior.

Exercise ambiguous, missing, contradictory, irrelevant, adversarial, Unicode, malformed, and near-budget inputs where relevant. Test instructions embedded in evidence as untrusted content. Do not claim prompt-injection immunity. Assert useful outcomes and failure contracts rather than merely accepting any string or snapshotting implementation details.

Every command must have an individual verdict. Suite-wide green status cannot hide an untested command. Fix defects and add focused regressions; do not weaken expectations or silently waive failures.

## 4. Prove the small-model-to-stronger-model workflow

Use explicit profiles and step routes. Evaluate a small local candidate and a stronger reference where available; report unsupported or unavailable combinations honestly. Do not select one global model based solely on aggregate scores. Publish command-specific suitability and hardware requirements supported by measurements.

Freeze thresholds and development/evaluation splits before tuning. Add diverse fixtures with independently authored or reviewed ground truth where feasible; keep template families separated. Record first-pass correctness, correctness after repair, errors, retries, requests, tokens when available, wall time, model identity/quantization, provider/runtime, hardware, revision, and fixture version. Preserve raw attempts. Never treat missing usage as zero or an AI review as a human review.

For the flagship workflows compare the same inputs and final-task criteria across local-only, direct stronger-model, and mixed-model execution. Include orchestration overhead and all stages. Measure final correctness, evidence retention, false negatives at selection stages, context volume reaching the stronger model, and latency. Report monetary cost only with supported usage and pricing; otherwise report usage. Prefer current official sources for any external compatibility or pricing claims.

Demonstrate an explicit handoff to at least one external harness through its supported interface. Inspect available integrations before choosing one. Define the handoff format, source references, uncertainty/omissions, size limits, and how the receiver consumes it. Verify the real invocation if available; otherwise deliver a tested file/stdin boundary and clearly mark live harness integration unverified. A compatible HTTP model endpoint is not itself a coding-harness integration.

Keep handoffs inspectable and user-directed. Do not introduce hidden escalation or invented confidence scores. If low-capability filtering harms recall, demonstrate a safer supported recipe, such as retaining original evidence alongside annotations, and document the tradeoff.

## 5. Make composition and documentation trustworthy

Run equivalent supported workflows through shell pipes, inline flows, and saved YAML. Test text/JSON/JSONL/record boundaries, metadata loss at export, field and annotation access, per-step routes, force-profile behavior, shared versus per-process budgets, buffering, and failure propagation. Verify that downstream models receive the intended evidence without invented provenance or silent truncation.

Ship runnable examples with small redistributable fixtures and expected deterministic outputs or semantic acceptance criteria. Test every release-critical documented invocation against the built artifact. Mock-provider examples should be reproducible offline; live examples should state prerequisites and be explicitly selectable.

Document clean-machine installation, a provider-free first result, local-model setup, command selection, input/output formats, errors, limits, mixed routes, recipes, harness handoffs, reusable definitions, extension development, and troubleshooting. Replace workstation assumptions with user-configurable examples. Explain extension trust and when content leaves the machine. Keep the command reference generated where appropriate, but add useful examples and semantic caveats beyond lists of flags.

## 6. Prepare an open-source release candidate

Inspect and prepare package/version metadata, platform artifacts, checksums, installation and uninstall instructions, SDK packaging, third-party notices, contributor setup, contribution guidance, security reporting, changelog/release notes, issue templates where useful, and CI. CI should run deterministic checks without model credentials; live evaluations remain separate. Include lint and formatting checks as well as type checks, tests, build, docs, and package smoke tests.

Test from an isolated installation without access to the source checkout or the maintainer's configuration. Distinguish cross-compilation from native platform validation. Report signing/notarization and unsupported-platform limitations without presenting untested binaries as supported.

Identify licensing and publication decisions requiring owner input; prepare concrete choices and affected files without inventing a legal grant or selecting the owner's license unilaterally. Do not delete private history or make the repository public. Preparing the release is authorized; publication, registry uploads, external messages, credentials, and paid inference require their applicable explicit authorization. Ask only for genuinely missing decisions or access, while continuing independent work.

## Completion criteria and working style

Start with the concise audit and proposed product thesis, then implement prioritized release work. Favor demonstrated usability and command reliability over new abstractions or more planning files. Maintain one current release checklist linking actual evidence.

The final handoff must include:

- The refined product promise and supported first-release scope.
- An individual acceptance verdict for all 22 commands and management surfaces.
- Reproducible commands, fixtures, live evaluation reports, and remaining limitations.
- Three tested flagship recipes, including mixed-model routing and a clearly verified or unverified harness boundary.
- Updated public-facing docs and contributor/release materials.
- A release recommendation separating blockers, nonblocking limitations, and owner decisions.

Do not call the release ready because tests pass, historical gates say ACCEPTED, or the documentation is complete. Readiness requires command correctness, measured semantic usefulness, trustworthy composition, reproducible onboarding, and resolved release blockers. If a required external check is unavailable, complete everything else and identify the exact remaining check. Never fabricate evidence or silently narrow the goal.
