# Semantic evaluation assets

All data is synthetic, authored by the implementation assistant with `scripts/datasets.ts`; no production or third-party content is included. Core data has 100 filter, 100 classify and 50 extraction examples. Five rubric families have 30 cases each. An explicit 20% development / 80% held-out split is recorded. IDs and exact inputs are unique; template families overlap across splits, so these fixtures do not establish broad out-of-distribution quality.

Ground truth follows the explicit synthetic facts. Independent reviewer sample audit and label-agreement measurements are **not complete**. Rubric cases require human factuality scoring; schema validity is not a correctness score. These assets are not an accepted EVAL-01 dataset until that audit is supplied.

`RIBBIT_RUN_LIVE_EVAL=1 npm run eval:semantic` explicitly runs three repetitions through the configured default local profile. It preserves every attempt/output/error and reports macro F1 and extraction field correctness. It does not authorize a hosted provider or claim rubric scores. Use a dedicated evaluation profile if global configuration changes. No failed gate is silently waived. Model digest, quantization and independent rubric review must accompany a release decision.
