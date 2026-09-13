# CONTRACT-02 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b08ef6f plus the contract details and fixtures in this change.

| Criterion | Result | Evidence |
| Shared built-in and extension API | PASS | Same command/config/action schema contract mandated |
| Help reads manifest | PASS | DECIDE-01 executable import sentinel and manifest specification |
| Imports only at explicit operations | PASS | DECIDE-01 installed run/check/discovery tests |
| Unsupported schema features fail precisely | PASS | Export policy specifies rejection; transform rejection checked |

Verification: `spikes/runtime/node_modules/.bin/tsc --noEmit --strict --skipLibCheck
--target ES2022 --module NodeNext fixtures/contracts/sdk.ts` (0),
`node fixtures/contracts/schema-check.mjs` (0). Type fixture proves defaults and
optional inference including expected compile failure. Complete SDK and adversarial
exporter implementation remain SDK-01/02; this ratifies their requirements.

Integrator decision: criteria satisfied at contract scope; accepted. No product behavior or release evidence inferred.
