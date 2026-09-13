# Routing contract

Status: RATIFIED by implementation integrator, 2026-09-13. Product scope unchanged.

Authority: PRD version 1.0; changes must update PRD and affected tasks together.

## 11. Provider/model routing (R-ROUTE)

Two initial adapters: native Ollama and OpenAI-compatible HTTP. Named providers configure type, base URL, optional default model and apiKeyEnv. Profiles configure provider/model and inference parameters. OpenAI-compatible is a tested protocol subset, not a claim every vendor works. Target conformance: native local Ollama, LM Studio compatible endpoint, and one hosted compatible test endpoint with credentials supplied by the tester. Custom base URLs are supported; native Anthropic/Gemini adapters are deferred.

Every semantic command and extension action receives --profile, --provider, --model. Profiles support temperature, maximum output tokens and timeout only when the selected adapter/model supports them; unsupported settings fail clearly. Credentials never appear in YAML definitions, diagnostics or manifests. Local-first means default setup selects a loopback provider; a local-looking proxy cannot establish that downstream inference stays local. No remote fallback on error. Provider selection in a project must be explicit and inspectable; no hidden provider selection based on content.

Resolution from strongest to weakest: explicit command/step CLI flags; flow step inference; named definition inference; user per-command routing; invocation flow default; saved flow default; global default. A layer with a profile selects a complete base profile and does not inherit a lower layer's provider/model tuple. Explicit fields within that same layer override the profile. A layer containing only model retains the lower resolved provider. A provider-only change resets model to that provider's configured default or errors if absent; it never carries an incompatible lower provider model. Non-route settings follow the same layering but retain compatible lower defaults unless explicitly reset. Capability checks run after route resolution. Unknown models do not auto-download.

For named commands, per-command rules match the definition name first, then its scoped type/action, then global defaults. Built-ins match canonical command name. A flow's --profile/--provider/--model supplies its invocation default; segment flags still win. --force-profile explicitly replaces all managed inference routes in the flow, including segment/definition overrides; incompatible capability requirements then fail preflight. Force changes routing only, not action arguments. Text prompts cannot change any route. Route inspect reports chosen provider/model and the source layer for each value, redacting secrets.

## Normative route table and protocol subset

[Precedence fixtures](../../../fixtures/routes/precedence.json) enumerate all 21
pairwise layer orderings plus provider reset, profile replacement and same-layer
explicit override. Fixture provider `local` has default model `local-default`;
`remote` has `remote-default`; profile `quality` selects remote/quality-model.
Resolved provider/model carry the supplying layer name. A provider field resets the
model even if its name equals the lower provider. A model-only field retains provider.
Profiles replace the route tuple; temperature/output-limit/timeout carry forward only
if compatible with final capability checks. A higher explicit profile parameter wins.
Force-profile runs last and replaces all inference defaults with the selected profile.

All config objects reject unknown fields. Providers declare capabilities explicitly:
text, stream, object, temperature, maxOutputTokens. Model context limits and a known
model allowlist may be configured; they are not guessed from names. Resolution checks
model membership when a list is configured. Setup/model discovery can inspect an
endpoint only when requested; pure route resolution never fetches. Configuration
stores environment variable names, never credential values. URL userinfo, query
credentials and non-HTTP(S) schemes are rejected. Diagnostics never include response
bodies or Authorization header content.

Supported HTTP subset: native Ollama `/api/tags`, `/api/chat` with model/messages,
stream, format JSON Schema and supported options; OpenAI-compatible `/models` and
`/chat/completions` under the configured base URL, model/messages, stream, temperature,
max_tokens and explicit supported response_format json_schema. Ollama streams NDJSON;
compatible streams SSE data messages terminated by `[DONE]`. Unexpected tool calls,
refusals, malformed/truncated events and missing completion markers fail. Structured
output is validated locally even with native schema support. No auto-pull, fallback,
tools or remote endpoint discovery. A 400/422 schema rejection is a capability error;
401/403/404 are configuration errors. Bounded 429/5xx retries share the request budget.
