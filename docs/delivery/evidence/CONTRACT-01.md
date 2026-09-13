# CONTRACT-01 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Revision: b08ef6f plus the contract details and fixtures in this change.

| Criterion | Result | Evidence |
| --- | --- | --- |
| All 22 input/output modes explicit | PASS | Normative details and 22-entry commands.json |
| Auto does not guess JSON | PASS | Wire fixture valid/invalid/literal cases; structural detection rule |
| Partial output and pipe closure specified | PASS | Streaming prefix and EPIPE rules |

Verification: Python JSON parsing (exit 0), 22-command count assertion (exit 0),
integrator comparison with PRD inventory. These are specification checks; engine
behavior is not implemented or claimed tested. Runtime fixture assertions belong to CORE-01.

Integrator decision: criteria satisfied at contract scope; accepted. No product behavior or release evidence inferred.
