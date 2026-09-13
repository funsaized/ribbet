# BASE-01 evidence

Date: 2026-09-13. Integrator: Codex, executing the owner's implementation instruction.
State: ACCEPTED.

## Baseline

Greenfield directory: only the two supplied planning Markdown files and empty protected
`.git`, `.agents`, `.codex` directories existed. No application, scripts, tests, lockfile,
or prior revision existed. Initial `git status --short` exited 128 (not a repository).
`git init -b main` first exited 128 (read-only sandbox mount); the same authorized
operation with elevated permissions exited 0. Revision is unborn; initial files untracked.
This evidence is recorded before the first baseline commit.

Linux x86_64; Node v26.7.0; Bun 1.4.0; Deno 2.9.6 (TypeScript 6.0.3);
fzf 0.74.3. Git, npm, Python 3 and Ollama executables are present. Standalone `tsc`
is absent from PATH. No dependency or model installation was performed for BASE-01.
The owner supplied macOS access as `saiguy@mini` over Tailscale. Read-only SSH with
`-F /dev/null -o BatchMode=yes -o ConnectTimeout=10` succeeded outside the network
sandbox: Darwin arm64, macOS 26.6.2 build 25G83; Node, Bun, Git and fzf present.
Default SSH configuration failed its ownership check; the empty-config override avoids
changing machine configuration. Sandboxed DNS failed; elevated SSH succeeded.

## Path mapping and amendment

Original `Ribbit-PRD.md` and `Ribbit-Implementation-Backlog.md` remain byte-for-byte
unchanged. Canonical product source is root `Ribbit-PRD.md`; active task index is
`docs/delivery/backlog.md`. Embedded delivery sections are extracted under
`docs/delivery/{tasks,contracts,evidence}` with corrected PRD links. These extraction
and status-tracking edits extend BASE-01's inventory scope to make the standalone
reading copy executable; no product requirements or contract approvals change.
Proposed implementation paths retain their names because no architecture exists.

## Acceptance

| Criterion | Result | Evidence |
| --- | --- | --- |
| Distinguish pre-existing failures | PASS | No test/build interface existed; Git and SSH failures recorded above |
| Identify greenfield repository | PASS | Initial inventory and unborn repository |
| Preserve planning files | PASS | SHA-256 values below, checked after extraction |

- Backlog: `20a4beaf12e1214431a625433c98c6424ce2731e6050c79b8754eea845de49a2`
- PRD: `f974c7772a59d2eb6fd117e804605743a88d127b7ea473cee67b196f807669e5`

Checks: `uname -sm`, runtime `--version` commands, `fzf --version`, Python hashlib,
and successful remote inventory all exited 0. No application tests claimed.
Integrator review: baseline criteria satisfied; DECIDE-01 may begin.
