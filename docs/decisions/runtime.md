# Runtime decision — DECIDE-01

Decision: use Bun-compiled native CLI executables, with explicit local extension builds
producing bundled ESM and cached JSON manifests. TypeScript 5.9.3 and Zod 4.1.13
are the prototype's exact dependency versions. Node with an explicitly declared
runtime is the tested fallback, not a second production execution path.

Both candidates passed installed consumer checks on Linux x86_64 and macOS arm64:
validation, dynamic installed ESM loading, streaming, SIGINT exit 130, and manifest
lookup with an import side-effect sentinel. Installed consumers contain no sources
or node_modules. macOS sandbox-exec denied networking while both loaded and ran the
extension successfully. No model or inference was involved.

| Runner | Node warm process p95 | Bun warm process p95 |
| --- | --- | --- |
| Linux x86_64 | 40.73 ms | 21.79 ms |
| Apple M1 macOS arm64 | 50.25 ms | 25.87 ms |

Each retained run has 30 warm samples plus a separately recorded first invocation.
These measure manifest discovery including process creation and the Node shell
launcher, with output capture; they are prototype measurements, not release PERF-01
results. OS page caches were not purged. Initial Mac first-invocation observations
were 296.17 ms (Node) and 923.84 ms (Bun); the retained rerun is separate and does not
supersede these slower initial observations. Do not label first-process time a
controlled cold-cache benchmark. Peak RSS measurements and hardware are in the raw
environment artifacts. macOS peak RSS was 49,364,992 bytes for Node and 32,178,176
bytes for Bun; RSS was sampled separately from the timed startup population.

Bun removes the user's runtime installation requirement and measured faster here.
Costs: larger native artifacts, platform builds, signing/installation verification,
and a runtime-specific bundler. Node's declared-runtime launcher is simpler to
maintain, but relies on compatible Node already being installed and adds startup cost.
Neither prototype demonstrates the final SDK or full CLI compatibility.

Versions: Linux Node 26.7.0/Bun 1.4.0; macOS Node 26.8.1/Bun 1.1.33.
The different runtime versions confound direct platform comparisons. BUILD-01/SHIP-01
must pin and test the same production Bun version on both targets; this feasibility
spike establishes both platforms can run the architecture, not that a production
artifact has passed cross-platform conformance. Existing fzf 0.74.3 is the supported
initial minimum on both reference runners; FS-05 must verify its exact flags and TTY
protocol. No source was copied from upstream projects.

Protocol sources consulted: [Bun executable documentation](https://bun.sh/docs/bundler/executables)
and [Node TypeScript documentation](https://nodejs.org/api/typescript.html).
Actual runtime behavior above was checked with local prototypes.
