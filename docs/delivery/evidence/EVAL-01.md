# EVAL-01 — Dataset preparation and sample review complete; REVIEW

250 synthetic core cases (100 filter, 100 classify, 50 extract), plus 30 cases in each of five rubric families. Provenance is the tracked generator; no confidential or third-party data. Splits are explicit. Two independent AI reviewers, blind to the authored answers and each other, labeled a seeded 50-item sample. Inter-reviewer and authored-label agreement were both 100%; see evals/review/agreement.json.

The review flagged shared sentence templates across development and held-out splits. Exact inputs are distinct, but this is a limited synthetic benchmark and not broad generalization evidence. Keep REVIEW until that limitation and rubric-case execution coverage are resolved in the release evaluation decision. No human annotation study is claimed.
