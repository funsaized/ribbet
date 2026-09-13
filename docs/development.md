# Development

Install pinned dependencies with `npm ci --ignore-scripts`. Build with Bun 1.4.0
using `npm run build`; run `dist/ribbit --help`. Development tooling uses TypeScript
5.9.3. Production builds must use the same Bun version on both targets.

Package boundaries: src/sdk (public contract), src/engine (records and execution),
src/cli (parsing and shell I/O), src/providers (managed HTTP), src/builtins (commands).
No public CI upload or publish operation is enabled.

| Script | Purpose |
| --- | --- |
| check | Strict TypeScript check |
| test:unit | Focused unit checks |
| test:consumer | Public SDK consumer checks when implemented |
| test:cli | Subprocess shell checks |
| test:conformance | Adversarial integration checks when implemented |
| test:docs | Local documentation links |
| build | Compile native development CLI |
| bench | PERF-01 runner; currently fails explicitly as unimplemented |
| eval:semantic | EVAL-02 runner; currently fails explicitly as unimplemented |
| eval:agent | AGENT-03 runner; currently fails explicitly as unimplemented |
| package:smoke | Isolated installed help/version smoke |

The consumer suite checks the public SDK; the conformance suite currently checks real loopback HTTP cancellation and needs local socket permission. Neither represents full release conformance. The current binary
is a foundation only; the 22-command implementation is tracked in the backlog.

Live provider harness: `scripts/live-provider.ts`; configuration and bounded invocation
are documented in [PROV-03 evidence](delivery/evidence/PROV-03.md).
