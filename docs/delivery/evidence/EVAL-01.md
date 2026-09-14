# EVAL-01 — ACCEPTED 2026-09-14

| Criterion | Result | Evidence |
| --- | --- | --- |
| Counts and label agreement reported | PASS | 250 core + 30×5 rubric; 50/50 blind agreement |
| No confidential production data | PASS | synthetic generator only |
| Held-out set distinct from prompt tuning set | PASS | unique IDs/inputs; template families overlap (not OOD proof) |
| Rubrics score factuality independently of schema | PASS | rubric-cases.json; schema validity is not the score |

Limitation: shared sentence templates across splits. Do not claim generalization. Reviewer decision: ACCEPTED.
