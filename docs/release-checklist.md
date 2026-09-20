# First open-source release checklist

Release decision: **the owner authorized an experimental public preview under MIT on 2026-09-20**, retaining all 22 commands and the Ribbit name. Broad quality review and an independent new-user pilot are follow-up work, not blockers for this explicitly scoped alpha. Native builds and acceptance tests determine which platform artifacts are published. This decision supersedes historical private publication restrictions.


## Architecture and audit

CLI parsing and input adapters produce typed text/JSON/record data. The execution engine applies schemas, routes, budgets, and cancellation. Built-ins and installed extensions use the same SDK contract. Managed inference reaches native Ollama or an OpenAI-compatible endpoint. YAML definitions reuse command types; linear flows bind typed outputs and apply per-step routes. Output adapters preserve the wire format until a deliberate export/display boundary.

The foundation was already substantial: the starting baseline passed 117 unit/integration tests, 11 CLI tests, one consumer test, and two conformance tests. The gaps were command-level packaged acceptance, missing live coverage for several semantic modes, workstation-specific onboarding, and a weakly demonstrated mixed-model/harness story. Existing synthetic quality reports and ACCEPTED delivery labels were treated as history.

During this work, compare's file reader was found to ignore the invocation byte budget. It now shares that budget across both files before inference. npm's production dependency audit identified AJV and YAML advisories; AJV 8.18.0 and YAML 2.8.3 resolve those reported advisories. [Before](../evals/results/dependencies/before.json) and [after](../evals/results/dependencies/after.json) reports are preserved. An empty audit report is not a security guarantee.

## Acceptance evidence

| Area | Evidence | Status |
| --- | --- | --- |
| All 22 built-ins | [Individual matrix](release-acceptance.md), [packaged tests](../tests/release/commands.test.ts) | Individual contract and CLI coverage; semantic suitability remains profile-specific |
| Management surfaces | [Lifecycle tests](../tests/release/management.test.ts) | Packaged configuration/discovery/extension/definition lifecycle |
| Composition | [Recipe tests](../tests/release/recipes.test.ts) | Real shell pipes, inline and saved flows agree; routes, originals, metadata, and budgets asserted |
| Local model evidence | [Per-command results](models.md) | Every semantic command and optional semantic mode exercised; failed attempts retained |
| Three product recipes | [Runnable guide](recipes.md), [model comparison](models.md) | Local-only/direct-stronger/mixed outputs and overhead measured on shared synthetic fixtures |
| External harness | [Model/harness evidence](models.md) | Actual local Codex read-only stdin handoff tested; not autonomous coding certification |
| Isolated distribution | [Smoke runner](../scripts/smoke.ts) | Copied binary/lib and isolated HOME/XDG paths; no maintainer config |
| Contributor and security guidance | [Contributing](../CONTRIBUTING.md), [security](../SECURITY.md) | MIT adopted; private reporting enabled for the public repository |
| CI | [Workflow](../.github/workflows/ci.yml) in source checkout | Native matrix covers Linux/macOS/Windows on x64/ARM64; see the linked Actions run for results |
| Release archive | `npm run package:release` | Binary/lib, curated public docs, source/fixtures, notices, BUILD metadata, checksum; historical private delivery docs excluded; uploaded only after successful native CI |

Run `npm run verify` for the local gate. Run `npm run package:release && npm run package:verify` to build and verify the review archive. It includes type checks, lint, formatting, unit/CLI/consumer/conformance tests, build, isolated package smoke, packaged release tests, and docs checks. Live evaluations are separately opt-in and do not run in default CI. Native startup p95 was measured separately: [startup report](../evals/results/startup.json). It does not re-establish every historical memory/performance gate. The final validation record is [verification.json](../evals/results/verification.json).

## What the evidence supports

The stronger installed local model passes the current public regression floor with a sufficient output-token allowance. The 0.5B candidate fails important semantic cases even when its JSON is valid. The supplied annotation recipes preserve evidence and allow downstream review, but do not establish speed, cost, or general quality improvement over direct stronger-model calls. Documentation explicitly describes this tradeoff.

The 22-command scope is retained. Exact modes can be presented with their tested deterministic contracts. Semantic commands should remain experimental and tied to measured profiles. Version `0.1.0-alpha.1` is an experimental preview; no 1.0 promise is introduced.

## Resolved release decisions and follow-up work

- MIT license, attributed to Sai Nimmagadda using the existing repository author identity.
- Public experimental preview authorized; publish on the configured `funsaized/ribbet` GitHub remote.
- Keep Ribbit as the product/executable name. Package metadata keeps `private: true` solely to prevent accidental npm publication; GitHub source and release assets are public.
- Independent held-out semantic review and a fresh-user pilot remain follow-up work. No broad quality or onboarding claim is made from synthetic tests.
- Native CI builds and tests all six desktop targets. macOS binaries are ad-hoc signed, not Apple Developer ID signed/notarized. Windows binaries are not Authenticode signed. Interactive picker validation uses real PTYs on Linux/macOS; Windows console interaction remains separately documented.

## Preview limitations

Trusted extensions have no sandbox. Semantic prompt injection is not solved. Input size limits may exceed a model's context window. Token usage can be unknown. Global ranking/grouping are bounded operations. Harness behavior varies by model and version. Full independent user studies and generalization claims are beyond the recorded evidence.

## Publication evidence

Native CI is the publication gate: each advertised archive must build, run its applicable tests, and pass isolated archive installation on its own OS/architecture. The public [Actions runs](https://github.com/funsaized/ribbet/actions) and [release assets](https://github.com/funsaized/ribbet/releases/tag/v0.1.0-alpha.1) identify the published revision and checksums. Earlier local evaluation reports remain tied to their recorded binary hashes and must not be relabeled as final-platform runs.
