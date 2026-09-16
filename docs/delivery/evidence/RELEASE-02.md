# RELEASE-02 — REVIEW 2026-09-16

Prepared the private launch decision packet. No publication, outreach or credential action
was taken.

Candidate: `ribbit-private` `0.1.0-dev.0`, revision `77a56c75cb3304b0ca2fced577c7a6b9dbfcf6df`
(binary built from source revision `629a1dc`; later commits are docs/benchmarks only).

| Criterion | Result | Evidence |
| --- | --- | --- |
| Owner can approve a concrete candidate | PASS | `docs/launch-decision.md` names the version, revision, install artifacts + checksums, measured results, known limits and unresolved owner decisions. |
| Private delivery is complete | PASS | Packet drafted in a private repository; artifacts reproducible from the recorded revision; no public action taken. |
| Publication remains pending explicit instruction | PASS | Packet states publication is a separate owner action; no repo/package/site visibility changed. |

## Verification

- `bun run scripts/docs.ts` → documentation links passed.
- Artifact checksums re-checked: Linux `322cadd9…`; macOS `e0abc053…` (signed `52dd197b…`).
- Packet numbers cross-checked against `evidence/RELEASE-01.md`, `EVAL-02.md`, `PERF-01.md`,
  `PILOT-01.md`, `docs/models.md`, `docs/performance.md`.

## Files changed

- `docs/launch-decision.md` (new).
- `docs/delivery/evidence/RELEASE-02.md` (this file).
- `docs/delivery/backlog.md` (state).

## Known limits

Carried from RELEASE-01 and stated in the packet: macOS signing required (unsigned killed);
RSS delta unexplained though under gate; synthetic/single-machine evals at `504eec4`
(whitespace-only delta); AI reviewer not human; single-user pilot; larger local model not
fully evaluated; extensions unsandboxed; Windows/Linux arm64 are follow-up.

## Reviewer decision

**REVIEW** — the packet is complete and ready for the owner's approval. Acceptance flips
RELEASE-02 to ACCEPTED (backlog 50/50); publication stays a separate owner action.
