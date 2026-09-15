# Semantic evaluation assets

All data is synthetic, authored by the implementation assistant with `scripts/datasets.ts`; no production or third-party content is included. Core data has 100 filter, 100 classify and 50 extraction examples. Five rubric families have 30 cases each. An explicit 20% development / 80% held-out split is recorded. IDs and exact inputs are unique; template families overlap across splits, so these fixtures do not establish broad out-of-distribution quality.

Ground truth follows the explicit synthetic facts. Two independent AI reviewers completed a blind 50-item sample audit with 100% agreement; see review/agreement.json. They identified cross-split template overlap and limited diversity. Rubric cases require factuality scoring against ground truth; schema validity is not a correctness score. EVAL-01 accepted 2026-09-14 with the template-overlap limitation above. These are not broad generalization evidence.

## Rubric cases (EVAL-02)

`datasets/rubric-cases.json` has 30 cases per family (rank, group, reduce, compare, explain). Each case is authored against the release contract and carries the actual CLI args, the structured input, a per-command rubric, and a factuality `expected` ground truth:

- `rank.expected.order` — the exact correct ordering under the stated criterion; `group.expected.partition` — the exact correct partition as id-sets (component/severity/environment axes are de-correlated by construction, so each instruction yields a different partition).
- `reduce`/`explain.expected.mustContain`/`mustNotContain` — fact entities a correct answer must include and fabricated claims it must not; `explain.forbid` — jargon barred for a non-technical audience.
- `compare.expected.leftOnly`/`rightOnly`/`mustNotContain` — facts unique to each source and known conflation phrases; the runner also verifies the two files are byte-identical before and after the call.

The gate is ≥85% of cases passing per family over three repetitions, scored by `scripts/rubric-scoring.ts` (pure, deterministic factuality: order/partition equality, fact presence/absence, file integrity). This is the deterministic floor; it does not replace independent reviewer scoring of free-text coherence and label quality, which must accompany any release decision.

`RIBBIT_RUN_LIVE_EVAL=1 npm run eval:semantic` runs the core semantic eval. Rubric families run as
`RIBBIT_RUN_LIVE_EVAL=1 RIBBIT_EVAL_PROFILE=<profile> bun run scripts/evaluate-rubrics.ts`, which
stores every output in `evals/results/rubrics-<model>.json` and the deterministic floor. The
independent reviewer pass is authored as `evals/review/rubrics-review.json` (case-level, 30
cases/family); `bun run scripts/rubric-rescore.ts` re-applies corrected ground truth to stored
outputs without re-inference, and `bun run scripts/rubric-gate.ts` computes the combined gate
(≥ 85 % on both the deterministic floor and the reviewer pass) into
`evals/results/rubrics-gate.json`. Both inference paths are loopback-only, preserve every
attempt/output/error, and report per-repetition variance. Use a dedicated evaluation profile if
global configuration changes. No failed gate is silently waived. Model digest, quantization and
independent rubric review must accompany a release decision.
