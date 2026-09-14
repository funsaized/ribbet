# Performance evidence

Reference Linux runner: AMD Ryzen 9 5900XT, 32 GiB RAM, Bun 1.4.0. Native macOS packaging runner: Apple M1, 16 GiB RAM. Budgets remain those in the release contract; no quality or timing thresholds were reduced.

`npm run bench` measures fresh processes with warm filesystem caches, one initial observation then 30 reported samples. It separates help, version and deterministic take. Initial help/version p95 was about 109 ms. Moving the compiler to the distribution's local `lib/` lowered it to about 39 ms. See `benchmarks/before-compiler-split.json` and `benchmarks/latest.json`. The compiler is available only for explicit extension authoring and does not download at runtime.

`python3 scripts/stream-bench.py` tests the same 100,000-small-record take/select workload against empty-input baseline processes, three times each. It reports both total and incremental RSS. A stricter total-RSS-only preliminary check exceeded 128 MiB; the specified gate is incremental RSS. No input size was reduced.

2026-09-14 Linux, release revision `dist/ribbit` SHA-256 `b23e33cf84064f3285486fa9c9079df074011a07f4c4565a797a02975aa6fc36`: help p95 38.7 ms, version p95 38.4 ms, take p95 73.9 ms; extension warm p95 121.4 ms (first 116.3 ms); managed pre-HTTP warm p95 66.2 ms (first 62.3 ms); 100k take incremental RSS 42936 KiB. Every Linux p95/RSS gate passed on a single build of this revision.

2026-09-14 macOS, same revision `dist/ribbit-darwin-arm64` SHA-256 `a9227bf8e914c0b523302a62dda45849d875362808e46322799ab3e7694345ea`: help p95 30.6 ms, version p95 29.8 ms (30 samples, Apple M1); extension warm p95 80.9 ms (first 80.8 ms); managed pre-HTTP warm p95 48.4 ms (first 48.8 ms). Raw samples in benchmarks/invocation-darwin.json. All p95 gates passed. The benchmark harness ran on Bun 1.1.33; the measured CLI embeds Bun 1.4.0. macOS RSS was not measured; the contract's RSS gate is on the Linux reference runner.

Both platform artifacts were rebuilt from one tree on 2026-09-14 and measured in place. No timing threshold was changed.
