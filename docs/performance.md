# Performance evidence

Reference Linux runner: AMD Ryzen 9 5900XT, 32 GiB RAM, Bun 1.4.0. Native macOS packaging runner: Apple M1, 16 GiB RAM. Budgets remain those in the release contract; no quality or timing thresholds were reduced.

`npm run bench` measures fresh processes with warm filesystem caches, one initial observation then 30 reported samples. It separates help, version and deterministic take. Initial help/version p95 was about 109 ms. Moving the compiler to the distribution's local `lib/` lowered it to about 39 ms. See `benchmarks/before-compiler-split.json` and `benchmarks/latest.json`. The compiler is available only for explicit extension authoring and does not download at runtime.

`python3 scripts/stream-bench.py` tests the same 100,000-small-record take/select workload against empty-input baseline processes, three times each. It reports both total and incremental RSS. A stricter total-RSS-only preliminary check exceeded 128 MiB; the specified gate is incremental RSS. No input size was reduced.

Extension cold/warm overhead, full managed pre-HTTP overhead, macOS timing and release regression review are not yet accepted. Platform install smoke is functional evidence, not performance evidence.

Later invocation benchmarks: Linux extension p95 123.5 ms and managed pre-HTTP p95 70.3 ms; macOS extension p95 82.0 ms and managed pre-HTTP p95 48.8 ms. Raw samples are in benchmarks/invocation-linux.json and invocation-darwin.json. Mac harness used Bun 1.1.33; the measured CLI embeds Bun 1.4.0. These preceded final audit fixes, so release-candidate performance verification remains open.
