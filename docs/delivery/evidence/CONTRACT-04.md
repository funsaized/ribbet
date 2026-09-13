# CONTRACT-04 — Accepted contract baseline

Integrator review, 2026-09-13. Reference grammar, inline argv ambiguity, streaming/materialization, templates and filesystem/picker behavior are specified in the maintained contract. This acceptance freezes behavior; it does not accept every downstream command or release gate.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Prior references only; invalid paths fail | PASS | tests/flows/flow.test.ts; exact and future-reference YAML fixtures |
| Filenames are never generated | PASS | Contract restricts semantic results to candidate IDs |
| Model reads explicit | PASS | names/content evidence flags and labels specified |
| Hostile picker labels preserve identity | PASS | scripts/picker-smoke.py real fzf selection/cancellation run |

`bun test tests/flows` passed four tests; real picker smoke exited 0 with successful original-record selection and exit-130 cancellation. No model quality claim is implied.
