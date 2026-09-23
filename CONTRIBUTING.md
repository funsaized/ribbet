# Contributing

Ribbit is an experimental open-source preview. Read the [product direction](docs/product-direction.md) and [release checklist](docs/release-checklist.md) before proposing scope changes. Contributions are licensed under the project's MIT license.

Use Bun 1.4.0, Node.js >=20, Python 3, and fzf >=0.74.3. Install the pinned dependencies with `bun install --frozen-lockfile --ignore-scripts`, then run `bun run verify`. Project builds and tests use Bun; Node.js/npm are needed for the npm distribution checks. Verification uses deterministic fixtures and loopback mock providers; no cloud credentials or model downloads are required. The picker checks use a real controlling PTY on Linux/macOS. Windows CI covers noninteractive commands; its native console picker requires manual interactive validation. A platform lacking required dependencies fails explicitly rather than silently skipping coverage.

For a defect, provide the exact command, sanitized fixture, expected result, actual stdout/stderr and exit status, version, platform, and provider/model when relevant. Do not attach credentials or private input. For semantic failures, distinguish malformed output from a well-formed but factually wrong answer.

Keep changes focused. Preserve stdout as data, explicit routes, bounded requests, cancellation, record identity, and documented failure behavior. Add a meaningful regression for a behavior change; avoid tests that merely repeat the implementation. Run the relevant tests, type checks, lint, format checks, build, and packaged acceptance tests. Generated manifests come from `bun run build`; do not hand-edit them.

Live evaluations are opt-in: see [evaluation instructions](evals/README.md). Store new evidence in a new timestamped directory, retain failures, and include the binary/fixture hashes. Never tune against a held-out dataset or lower a gate silently. AI review is not human review, and a synthetic pilot is not a user study.

No publication or remote upload is part of the development scripts. Pull requests should describe the problem, resulting behavior, evidence, and remaining limitations.

Documentation uses Diátaxis: keep lessons, task guides, reference, and explanation distinct. Follow the [documentation contributor instructions](docs/development.md#documentation), run `bun run test:docs`, and build the site with `mkdocs build --strict`.
