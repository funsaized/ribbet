# PROV-03 evidence and blocker

State: BLOCKED (implementation and mock tests complete; live conformance unavailable).
Date: 2026-09-13. Integrator: Codex.
Revision: b5ba67d plus routing/provider implementation changes.

| Criterion | Result | Evidence |
| --- | --- | --- |
| LM Studio live conformance | UNVERIFIED | Default 127.0.0.1:1234 endpoint unreachable on Linux and mini; no alternative supplied |
| Hosted endpoint live conformance | UNVERIFIED | No hosted test URL/model/key environment reference supplied |
| Unsupported schema errors actionable | PASS | Schema preflight and mapped 400/422 capability/config errors |
| Authorization never logged | PASS | Generic transport/status diagnostics discard response body; no-key and missing-key tests |

Implemented: configurable base URL, environment-key lookup, model listing, SSE text,
JSON Schema response format, bounded response reads, strict completion/refusal/tool
handling and cancellation. Mock protocol tests pass; they are not evidence that an
actual LM Studio or hosted model supports this subset.

Checks on 2026-09-13:

- Authorized Python urllib GET http://127.0.0.1:1234/v1/models on Linux: URLError.
- Authorized SSH to saiguy@mini, `curl --silent --show-error --max-time 3
  http://127.0.0.1:1234/v1/models`: exit 7, connection refused.
- RIBBIT_TEST_HOSTED_BASE_URL, RIBBIT_TEST_HOSTED_MODEL and
  RIBBIT_TEST_HOSTED_API_KEY_ENV were all unset. Only presence was checked; no
  credential values were printed. An alternative endpoint may exist but is unknown.

Smallest next action: provide a running LM Studio endpoint with loaded model and an
owner-selected hosted compatible endpoint/model, plus the name of an environment
variable holding its key. Do not paste the key into documentation or chat. The Mac
is reachable; platform access is not the blocker. No model/provider install, account
creation, public upload or endpoint substitution was performed to manufacture evidence.

Run each endpoint using:

```sh
RIBBIT_TEST_BASE_URL=http://HOST:PORT/v1 RIBBIT_TEST_MODEL=MODEL bun run scripts/live-provider.ts compatible
```

For an authenticated endpoint additionally set RIBBIT_TEST_API_KEY_ENV to the name
of its existing key variable. The harness allows at most four managed inference
attempts, 60 seconds per request and 120 seconds total. Endpoint discovery is read-only.

A gate amendment could separate live external conformance from implementation
acceptance, retaining it as a release requirement; that changes the supplied delivery
dependency plan and has not been applied. Under the current task stop conditions,
PROV-03 cannot be accepted. The owner requested implementation until a blocker;
work stops here with remaining tasks accurately tracked in the backlog.

## Update, 2026-09-13

The LM Studio portion is now resolved: the user's desktop install serves the downloaded
Qwen2.5-0.5B-Instruct model; see provider-lmstudio-live.json and the integrated evidence.
Hosted endpoint conformance is still blocked pending the owner's endpoint/model and
API-key environment-variable name. Do not treat a local compatible server as hosted evidence.
