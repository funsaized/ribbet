# CONTRACT-05 — Reference gates ratified

Integrator decision, 2026-09-13. Use the unchanged numeric thresholds in the release contract. Linux reference: Ryzen 9 5900XT / 32 GiB / Bun 1.4.0. macOS reference: M1 / 16 GiB / packaged Bun 1.4.0. Functional native platform checks are not timing evidence.

| Criterion | Result |
| --- | --- |
| Hardware/runtime named | PASS |
| Startup separated from inference | PASS: scripts/bench.ts |
| Quality counts, repetitions, macro F1 and factuality thresholds defined | PASS: release contract and evals assets |
| Human/agent evidence not replaced with simulations | PASS: independent gates explicitly remain blocked |

Warm timing uses 30 fresh processes after one initial observation; raw samples are retained. Stream RSS is maximum workload peak minus minimum same-argv empty-input peak across three observations, with full totals also reported. Semantic attempts preserve output/error and are repeated three times. Unknown usage remains unknown. Rubrics and pilot scoring require independent reviewers/participants. Ratification is not a claim that measured gates pass.
