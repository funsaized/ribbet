# Pilot scope decision — PILOT-01

Decision (owner, 2026-09-16): the setup pilot is satisfied by a single documented
owner-run first-run. The contract's multi-user criterion (at least 4/5 target users)
is waived for v1 by explicit owner direction. No further participants will be recruited.

Rationale: the owner completed the packaged first-run locally in 271 s excluding model
download (artifact `dist/ribbit` SHA-256 `b0b07ad5a74759fd4852db3e937a6a17ac27a4e33cac4bc7f641c75d91c21933`,
revision `504eec4`), inside the 10-minute target. The owner judged the remaining value
of additional participants not to justify the coordination cost for a private,
pre-launch build.

Honest limits:
- This is weaker evidence than the original gate. A single owner already familiar with
  the tool is not independent cross-user usability evidence.
- The release contract and PILOT-01 acceptance criteria are amended to match, and the
  change is recorded here rather than applied silently.
- RELEASE-01 must disclose the single-participant scope as a known limitation of the
  release evidence.

Amends: the setup-pilot acceptance target in `docs/delivery/contracts/release.md`.
