# Ribbit

Private, local-first semantic shell toolkit. Implementation is in progress.

- [Product requirements](Ribbit-PRD.md)
- [Active backlog](docs/delivery/backlog.md)
- [Execution rules](docs/delivery/README.md)
- [Baseline evidence](docs/delivery/evidence/BASE-01.md)

The original planning documents are preserved. Follow-up tasks are outside the initial
release. No package or executable is release-ready until its acceptance gates pass.

Current state: foundation, typed SDK, bounded record engine, route resolution and
provider adapters are implemented. The CLI currently exposes development help/version;
the 22 public commands are not wired or implemented yet.

Validation: 68 unit tests, one SDK consumer test, one CLI subprocess test and one
loopback HTTP conformance test passed; builds/install smoke passed on Linux and macOS.
The installed local Ollama model passed live text and structured-output checks.

Implementation stopped at [PROV-03's external conformance blocker](docs/delivery/evidence/PROV-03.md):
a running LM Studio endpoint and a hosted compatible test endpoint are needed.
See [development commands](docs/development.md) to build and run checks.
