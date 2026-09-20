# Configuration and routing

## Locations

| Item | Location |
| --- | --- |
| Global configuration | `${XDG_CONFIG_HOME:-$HOME/.config}/ribbit/config.yaml` on Unix; the same XDG override or the user's home `.config/ribbit/config.yaml` on Windows |
| Project inference | `.ribbit.yaml` in the working project |
| Project named commands | `commands/*.yaml` or `commands/*.yml` |
| Global named commands | `commands/` beside the global config file |
| Installed extensions | `${XDG_DATA_HOME:-$HOME/.local/share}/ribbit/extensions`, using the user's home on Windows |

Global config contains `schemaVersion: 1`, `providers`, `profiles`, `default`, and `routes`. A project config uses `apiVersion: ribbit/v1` and an optional `inference` object.

The project-root `.env` file is loaded at CLI startup. Existing process environment values take precedence; a missing file is allowed. Credentials are referenced by environment-variable name, never stored as literal provider keys.

## Provider fields

| Field | Meaning |
| --- | --- |
| `type` | `ollama` or `openai-compatible` |
| `baseUrl` | HTTP(S) endpoint without embedded credentials, query, or fragment |
| `apiKeyEnv` | Optional environment-variable name for authentication |
| `defaultModel` | Optional model ID used with a provider-only override |
| `models` | Optional allowlist of model IDs |
| `contextTokens` | Optional declared context size |
| `capabilities` | Declared subset of `text`, `stream`, `object`, `temperature`, `maxOutputTokens`, `reasoning` |

Capabilities must match the endpoint. A resolved route requiring an undeclared capability fails before inference.

## Inference fields

`profile`, `provider`, `model`, `temperature`, `maxOutputTokens`, `timeout`, and `reasoning` are the supported inference keys. A profile names a complete provider/model route with optional settings. `reasoning` is `off` or `on`.

For an example global default:

```yaml
default:
  profile: local-small
```

This fragment belongs in an existing valid global config and requires that profile to exist. Use [model setup](../how-to/configure-models.md) to create providers and profiles.

## Precedence

Routes merge from weaker to stronger layers:

1. Global default.
2. Project inference.
3. Saved flow inference.
4. Flow invocation defaults.
5. Per-command route.
6. Named definition inference.
7. Step inference.
8. Command/segment CLI overrides.

`--force-profile` replaces managed routes across a flow after these layers. It applies only to flows. A provider override selects that provider's default model unless the layer also supplies a model; it does not silently retain another provider's model.

Inspect a route with `ribbit route inspect COMMAND --profile NAME --json`. No automatic fallback occurs when a route fails.

## Reasoning controls

Ollama uses its native `think` field. The compatible adapter sends `chat_template_kwargs.enable_thinking` only when the provider declares `reasoning`; support depends on the server and model template. Structured managed calls default reasoning off when control is available. Free-text calls keep the model's default unless configured.

A model may spend its output allowance on internal reasoning before producing a visible answer. Configure an appropriate `maxOutputTokens` in the profile; it is distinct from the invocation's aggregate `--max-tokens` budget.
