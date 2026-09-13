# CONTRACT-03 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b5ba67d plus route contract, fixtures, configuration and resolver changes.

| Criterion | Result | Evidence |
| --- | --- | --- |
| All precedence pairs | PASS | 21 pairwise fixtures; 28 resolver tests total |
| Profile/provider reset | PASS | Model-only inheritance, provider default, profile tuple reset and force-profile |
| Pure inspection and early invalid-route errors | PASS | Resolver imports no transport; tests invalid routes/capabilities/models and redaction |

`npm run check` and `bun test tests/routing` exit 0. Fixtures are valid JSON and
expected provider/model provenance is compared directly. Unknown config keys,
credential-bearing URLs, unsupported settings and unknown model allowlists fail.
Global/project YAML loaders reject duplicate keys and excessive aliases. No endpoint
was contacted by these checks. Project configuration currently declares apiVersion
and inference only; additional definition/extension locations belong to later tasks.

Protocol documentation consulted: [Ollama chat](https://docs.ollama.com/api/chat),
[Ollama streaming](https://docs.ollama.com/api/streaming), and
[LM Studio compatibility](https://lmstudio.ai/docs/developer/openai-compat).
Live conformance is explicitly deferred to PROV-02/03, not counted as passed here.

Integrator decision: accepted within contract/resolver scope.
