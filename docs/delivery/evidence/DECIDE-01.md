# DECIDE-01 evidence

State: ACCEPTED. Date: 2026-09-13. Integrator: Codex.
Base revision: f3ee66d; runtime spike and this evidence were uncommitted during checks.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Installed extension loads without network | PASS | macOS deny-network sandbox, both runtimes; runtime-offline-macos.txt |
| Schema discovery executes no extension | PASS | Import sentinel asserted absent for 31 invocations per candidate per runner |
| Packaging supports both target platforms | PASS | Native Bun executable and declared-Node launcher installed in isolated temporary directories on each platform |
| Latency/RSS and maintenance tradeoffs recorded | PASS | runtime.md and runtime-{linux,macos}.{json}; environment text files |
| Target changes documented | PASS | Neither target changed |

Commands and outcomes:

- Offline npm install: exit 1, uncached @types/node. Corrected by explicit pinned package download.
- `npm install --prefix spikes/runtime --ignore-scripts --no-audit --no-fund --cache /tmp/ribbit-npm-cache`: 0.
- `bash spikes/runtime/build.sh`: 0 on both platforms (includes strict TypeScript check).
- `python3 spikes/runtime/verify.py`: 0 on Linux; `python3 verify.py`: 0 on Mac.
- `/usr/bin/time -v` was unavailable on Linux (127); corrected using Python `os.wait4` per-process peak RSS, both exits 0 (runtime-linux-rss.json). `/usr/bin/time -l` on Mac: 0 for both discovery commands.
- `sandbox-exec -p '(version 1)(allow default)(deny network*)' dist/install/ribbit-{bun,node} run dist/install offline 2`: 0 for each on Mac.

Retained JSON includes 30 warm samples and one first invocation for each candidate.
Initial Mac run was followed by a retained measurement run; slower first observations
remain disclosed in the decision. No controlled cold-cache or production performance
claim. Different Bun versions are disclosed and must be aligned for production.

Files: spikes/runtime/{package.json,package-lock.json,tsconfig.json,extension.ts,main.ts,
build.sh,verify.py}; docs/decisions/runtime.md; runtime evidence files.
No providers, credentials, outreach, or publication used.
Integrator decision: accept feasibility and the runtime choice. Production performance,
SDK trust handling, same-version platform validation and packaging remain their own gates.
