# CMD-06 — ACCEPTED 2026-09-14

| Criterion | Result | Evidence |
| --- | --- | --- |
| Zero provider calls | PASS | exact commands have empty capabilities |
| Missing fields/mixed sort types explicit | PASS | sort mixed-type code 2 |
| Unique keeps first | PASS | canonical uniqueness test |
| Take zero does not consume upstream | PASS | take 0 / 100k pull count |

Also: 100k take pulls exactly 100k; unique key set charged against maxBytes; index bound 1e6. Reviewer decision: ACCEPTED.
