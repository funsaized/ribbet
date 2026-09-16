# PILOT-01 — ACCEPTED 2026-09-16

State: **ACCEPTED** (amended scope). Gate: a documented owner-run local first-run within
10 minutes excluding model download. Multi-user sampling was waived by explicit owner
decision — see `docs/decisions/pilot-scope.md`.

Revision: `504eec4`  Artifact: `dist/ribbit` SHA-256 `b0b07ad5a74759fd4852db3e937a6a17ac27a4e33cac4bc7f641c75d91c21933`

Environment: Linux workstation, LM Studio on loopback, model `gemma-4-e4b` (8192 context,
preloaded; download 0 s). Packaged distribution only (`dist/ribbit` plus adjacent `lib/`).

| ID | Platform | Excl-download (s) | First attempt | Repaired | Within 10 min | Blockers |
| --- | --- | --- | --- | --- | --- | --- |
| P01 | linux | 271 | pass | n/a | yes | local server not running (environment prerequisite) |

Result: 1/1 owner session completed within target (271 s < 600 s). All six pilot tasks
completed (owner report): help/version/discovery; exact take pipe; `setup`/`doctor`;
`explain` of a nonconfidential file; a flow; and a recurring-task answer.

Blockers (tracked): the LM Studio local server must be started manually. When it is off,
every semantic command fails with `Provider endpoint unreachable (details redacted)`,
which gives no hint about the cause. Candidate follow-up task: have that error point at
`ribbit doctor --probe`. Observed during preparation; not counted in the timed elapsed.

Limitations: a single owner participant, already familiar with the tool, is weaker
evidence than the original multi-user gate and is not independent cross-user usability
evidence. Measurements cover one workstation and one model.

Reviewer decision: ACCEPTED (amended scope per owner decision).
