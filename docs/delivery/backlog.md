# Executable implementation backlog

Version 1.0 · Private implementation tracking · Updated 2026-09-15

Read [execution rules](README.md), [PRD](../../Ribbit-PRD.md), and [contracts](contracts/cli-data.md). Sizes are intentionally not time estimates; each task is a bounded deliverable and may be split before dispatch without weakening acceptance.

| ID | Assignment | Class | Parent | Direct dependencies | State |
| --- | --- | --- | --- | --- | --- |
| [BASE-01](tasks/BASE-01.md) | Establish repository and delivery baseline | Required | G1–G8 | — | ACCEPTED |
| [DECIDE-01](tasks/DECIDE-01.md) | Prove the runtime and distribution path | Required gate | G2/G7; R-EXT/R-PERF | BASE-01 | ACCEPTED |
| [CONTRACT-01](tasks/CONTRACT-01.md) | Freeze command and data contracts | Required gate | G1/G5; R-DATA | DECIDE-01 | ACCEPTED |
| [CONTRACT-02](tasks/CONTRACT-02.md) | Freeze SDK, build and extension trust contracts | Required gate | G2/G6; R-EXT | DECIDE-01 | ACCEPTED |
| [CONTRACT-03](tasks/CONTRACT-03.md) | Freeze routing and provider conformance | Required gate | G4; R-ROUTE | DECIDE-01 | ACCEPTED |
| [CONTRACT-04](tasks/CONTRACT-04.md) | Freeze linear flow and filesystem contracts | Required gate | G3/G5; R-FLOW/R-FS | CONTRACT-01, CONTRACT-02, CONTRACT-03 | ACCEPTED |
| [CONTRACT-05](tasks/CONTRACT-05.md) | Ratify measurable release gates | Required gate | G7/G8; R-PERF | DECIDE-01 | ACCEPTED |
| [BUILD-01](tasks/BUILD-01.md) | Create workspace, scripts and CI skeleton | Required | G2/G7 | CONTRACT-01, CONTRACT-02 | ACCEPTED |
| [CORE-01](tasks/CORE-01.md) | Implement record adapters and wire format | Required | R-DATA | BUILD-01 | ACCEPTED |
| [CORE-02](tasks/CORE-02.md) | Implement execution lifecycle and budgets | Required | R-DATA/R-PERF | CORE-01 | ACCEPTED |
| [SDK-01](tasks/SDK-01.md) | Implement typed command SDK | Required | R-EXT | BUILD-01 | ACCEPTED |
| [SDK-02](tasks/SDK-02.md) | Generate manifests and CLI schema bindings | Required | R-EXT/G6 | SDK-01 | ACCEPTED |
| [EXT-01](tasks/EXT-01.md) | Build and explicitly install local extensions | Required | R-EXT | SDK-02, CORE-02 | ACCEPTED |
| [EXT-02](tasks/EXT-02.md) | Execute extension actions through shared engine | Required | G2/R-EXT | EXT-01, SDK-01, CORE-02 | ACCEPTED |
| [CLI-01](tasks/CLI-01.md) | Implement parser and shell behavior | Required | G1/G5 | SDK-02, CORE-02 | ACCEPTED |
| [CLI-02](tasks/CLI-02.md) | Implement catalog, discovery and completion | Required | G6 | CLI-01, EXT-01 | ACCEPTED |
| [ROUTE-01](tasks/ROUTE-01.md) | Implement configuration and route resolver | Required | G4/R-ROUTE | BUILD-01, CONTRACT-03 | ACCEPTED |
| [ROUTE-02](tasks/ROUTE-02.md) | Implement provider/profile management and inspection | Required | G4/G6 | ROUTE-01, CLI-01 | ACCEPTED |
| [PROV-01](tasks/PROV-01.md) | Implement managed inference interface | Required | G4/R-EXT | ROUTE-01, SDK-01, CORE-02 | ACCEPTED |
| [PROV-02](tasks/PROV-02.md) | Implement native Ollama adapter | Required | G4 | PROV-01 | ACCEPTED |
| [PROV-03](tasks/PROV-03.md) | Implement OpenAI-compatible adapter | Required | G4 | PROV-01 | ACCEPTED |
| [PROV-04](tasks/PROV-04.md) | Implement setup, doctor and model discovery | Required | G4/G8 | PROV-02, PROV-03, ROUTE-02, CLI-02 | ACCEPTED |
| [CMD-01](tasks/CMD-01.md) | Ship ask, summarize, explain and rewrite | Required | C01–C04 | EXT-02, CLI-01, PROV-01 | ACCEPTED |
| [CMD-02](tasks/CMD-02.md) | Ship extract and classify | Required | C05–C06 | EXT-02, CLI-01, PROV-01 | ACCEPTED |
| [CMD-03](tasks/CMD-03.md) | Ship filter and map | Required | C07/C10 | EXT-02, CLI-01, PROV-01 | ACCEPTED |
| [CMD-04](tasks/CMD-04.md) | Ship rank and group | Required | C08–C09 | EXT-02, CLI-01, PROV-01 | ACCEPTED |
| [CMD-05](tasks/CMD-05.md) | Ship reduce and compare | Required | C11–C12 | EXT-02, CLI-01, PROV-01 | ACCEPTED |
| [CMD-06](tasks/CMD-06.md) | Ship deterministic projection and sequence helpers | Required | C18–C21 | EXT-02, CLI-01 | ACCEPTED |
| [CMD-07](tasks/CMD-07.md) | Ship render and safe templates | Required | C22 | EXT-02, CLI-01, CONTRACT-04 | ACCEPTED |
| [FS-01](tasks/FS-01.md) | Implement traversal and text readers | Required | R-FS | CORE-01, CORE-02, CONTRACT-04 | ACCEPTED |
| [FS-02](tasks/FS-02.md) | Ship ls and read | Required | C13/C17 | FS-01, EXT-02, CLI-01 | ACCEPTED |
| [FS-03](tasks/FS-03.md) | Ship semantic find | Required | C14 | FS-02, CMD-03 | ACCEPTED |
| [FS-04](tasks/FS-04.md) | Ship tree with semantic annotations | Required | C15 | FS-02, CMD-01, CMD-03 | ACCEPTED |
| [FS-05](tasks/FS-05.md) | Ship interactive pick with backend integration | Required | C16 | FS-02, CMD-04 | ACCEPTED |
| [FLOW-01](tasks/FLOW-01.md) | Implement YAML definitions and resolution | Required | G3/R-FLOW | SDK-02, ROUTE-01, CLI-02 | ACCEPTED |
| [FLOW-02](tasks/FLOW-02.md) | Implement typed linear flow planner | Required | G3/R-FLOW | FLOW-01, CONTRACT-04 | ACCEPTED |
| [FLOW-03](tasks/FLOW-03.md) | Execute flows with shared runtime and limits | Required | G3/G4 | FLOW-02, EXT-02, PROV-01 | ACCEPTED |
| [AGENT-01](tasks/AGENT-01.md) | Implement scaffolding and fixture runner | Required | G6 | EXT-01, SDK-02 | ACCEPTED |
| [AGENT-02](tasks/AGENT-02.md) | Ship agent guidance initialization | Required | G6 | AGENT-01, CLI-02, FLOW-02 | ACCEPTED |
| [AGENT-03](tasks/AGENT-03.md) | Run independent agent consumer evaluation | Required gate | G6/R-PERF | AGENT-02, FLOW-03, CMD-01, CMD-02 | ACCEPTED |
| [QA-01](tasks/QA-01.md) | Build adversarial conformance suite | Required | G5/G8 | FLOW-03, FS-05, CMD-07 | ACCEPTED |
| [EVAL-01](tasks/EVAL-01.md) | Create labeled semantic datasets and rubrics | Required | G7 | CONTRACT-05 | ACCEPTED |
| [EVAL-02](tasks/EVAL-02.md) | Select default small local model and evaluate commands | Required gate | G7 | EVAL-01, PROV-02, PROV-03, CMD-01, CMD-02, CMD-03, CMD-04, CMD-05, FS-03, FS-04 | BLOCKED |
| [PERF-01](tasks/PERF-01.md) | Measure and optimize runtime overhead | Required gate | G7 | CONTRACT-05, FLOW-03, FS-05, CMD-06, CMD-07 | ACCEPTED |
| [SHIP-01](tasks/SHIP-01.md) | Package installable artifacts for target platforms | Required | G8 | QA-01, PERF-01 | ACCEPTED |
| [DOCS-01](tasks/DOCS-01.md) | Write complete command, SDK and routing docs | Required | G1/G6 | FLOW-03, FS-05, AGENT-02 | ACCEPTED |
| [DOCS-02](tasks/DOCS-02.md) | Verify docs against packaged CLI | Required | G1/G8 | DOCS-01, SHIP-01 | ACCEPTED |
| [PILOT-01](tasks/PILOT-01.md) | Validate first-run and recurring use cases with owner-selected users | Required human evidence | G8/R-PERF | DOCS-02, EVAL-02 | BLOCKED |
| [RELEASE-01](tasks/RELEASE-01.md) | Audit complete initial scope and release evidence | Required gate | G1–G8 | AGENT-03, EVAL-02, PERF-01, DOCS-02, PILOT-01 | BLOCKED |
| [RELEASE-02](tasks/RELEASE-02.md) | Prepare private launch decision packet | Required gate | G8 | RELEASE-01 | BLOCKED |
| [FOLLOW-01](tasks/FOLLOW-01.md) | Explore additional native providers | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-02](tasks/FOLLOW-02.md) | Explore branching flows and nested invocation | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-03](tasks/FOLLOW-03.md) | Explore sandboxed extension distribution | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-04](tasks/FOLLOW-04.md) | Explore filesystem mutations and plan/apply | Post-release | Deferred | RELEASE-02 | BLOCKED |
| [FOLLOW-05](tasks/FOLLOW-05.md) | Explore wider platforms, ingestion and indexing | Post-release | Deferred | RELEASE-02 | BLOCKED |

## Milestones and dispatch

1. Foundation: BASE-01, DECIDE-01, CONTRACT-01 through CONTRACT-05, BUILD-01.
2. Usable engine: CORE/SDK/EXT/CLI/ROUTE/PROV tracks; a typed external command runs through a local provider.
3. Complete command set: CMD and FS tracks; all 22 public commands work through the shared contract.
4. Composition and agents: FLOW/AGENT tracks; named definitions and mixed-route flows pass consumer tests.
5. Release evidence: QA/EVAL/PERF/SHIP/DOCS/PILOT; all thresholds measured, none assumed.
6. Private release-ready audit and owner decision packet: RELEASE-01/02.

Runtime/schema work is the critical path. EVAL-01 can prepare datasets while runtime implementation proceeds. Filesystem and provider adapter tasks can be scheduled independently once their dependencies are accepted. This is an execution dependency plan, not a request to launch parallel agents now.

## Scope control

All Required, Required gate and Required human evidence tasks block full v1 acceptance. FOLLOW tasks are explicitly excluded. No estimated calendar date is committed: runtime feasibility, model evaluation and real-user scheduling are not yet measured. After BASE/DECIDE acceptance, size tasks against actual repository context and sequence within team capacity.

## Current delivery state — 2026-09-15

Of 50 required tasks: **46 ACCEPTED, 0 REVIEW, 0 owner-deferred, 4 BLOCKED**.
The five FOLLOW tasks are outside initial scope and remain inactive.

PROV-03 is accepted: LM Studio and a hosted OpenAI-compatible endpoint both have
recorded live conformance. PROV-04 followed its prerequisite to acceptance.

BLOCKED: EVAL-02 (rubric families outstanding; semantic gate now passed),
PILOT-01 (human evidence), RELEASE-01/02 (final gates).

Both platform artifacts rebuilt from one tree and measured in place:
Linux help/version p95 38.7/38.4 ms, extension 121.4 ms, managed 66.2 ms, 100k RSS 42936 KiB;
macOS help/version 30.6/29.8 ms, extension 80.9 ms, managed 48.4 ms. Linux unit 111,
CLI 11, consumer 1, conformance 2, docs/build/smoke, picker PTY; macOS docs-examples and
extension smoke pass.

Latest semantics: gemma-4-e4b passes the filter/classify/extract gate in three independent
full runs (mean 1.000 / 1.000 / 0.919, zero harness errors); Qwen2.5 0.5B, Qwen2.5 1.5B
and Qwen3.5 9B do not pass. It is the selected v1 default; see [models](../models.md).
Rubric families are not yet evaluated.

See [handoff](HANDOFF.md) and [checkpoint](evidence/CHECKPOINT-20260914.md).
