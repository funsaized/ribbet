# Individual release acceptance

Contract and packaged-CLI checks are separate from live semantic correctness. All command rows below have packaged happy-path coverage plus relevant failure/invariant coverage. Live scores are small public regression samples, not broad quality certification or independent review. The current [release checklist](release-checklist.md) determines release readiness.

Run `bun run build && bun run test:release`. The [case catalog](../scripts/release/cases.ts) supplies exact args, inputs, mock replies, and assertions; [command examples](command-examples.md) render them for readers. `pick` additionally uses the real fzf backend on a controlling PTY. The [failure suite](../tests/release/commands.test.ts) and the existing filesystem/record/budget suites cover relevant edge behavior.

| Command | Case IDs / modes | Contract + packaged CLI | Stronger live floor | 0.5B live floor | Verdict |
| --- | --- | --- | --- | --- | --- |
| ask | ask-grounded, ask-injection | PASS | 6/6 | 3/6 | Contract accepted; semantic use experimental and profile-specific |
| classify | classify-preserve | PASS | 3/3 | 1/3 | Contract accepted; semantic use experimental and profile-specific |
| compare | compare-sources | PASS | 3/3 | 3/3 | Contract accepted; semantic use experimental and profile-specific |
| explain | explain-audience | PASS | 3/3 | 3/3 | Contract accepted; semantic use experimental and profile-specific |
| extract | extract-missing | PASS | 3/3 | 3/3 | Contract accepted; semantic use experimental and profile-specific |
| filter | filter-recall | PASS | 3/3 | 0/3 | Contract accepted; semantic use experimental and profile-specific |
| find | find-exact, find-semantic | PASS | 3/3 | 1/3 | Contract accepted; semantic use experimental and profile-specific |
| group | group-partition | PASS | 3/3 | 0/3 | Contract accepted; semantic use experimental and profile-specific |
| ls | ls-metadata | PASS | n/a | n/a | Deterministic behavior covered by native release CI |
| map | map-lineage, map-schema | PASS | 6/6 | 6/6 | Contract accepted; semantic use experimental and profile-specific |
| pick | exact, semantic ranking, cancellation | PASS | 3/3 | 3/3 | Contract accepted; semantic use experimental and profile-specific |
| rank | rank-permutation | PASS | 3/3 | 3/3 | Contract accepted; semantic use experimental and profile-specific |
| read | read-boundaries | PASS | n/a | n/a | Deterministic behavior covered by native release CI |
| reduce | reduce-evidence, reduce-chunked | PASS | 6/6 | 3/6 | Contract accepted; semantic use experimental and profile-specific |
| render | render-values | PASS | n/a | n/a | Deterministic behavior covered by native release CI |
| rewrite | rewrite-facts | PASS | 3/3 | 3/3 | Contract accepted; semantic use experimental and profile-specific |
| select | select-fields | PASS | n/a | n/a | Deterministic behavior covered by native release CI |
| sort | sort-numeric | PASS | n/a | n/a | Deterministic behavior covered by native release CI |
| summarize | summarize-facts | PASS | 3/3 | 3/3 | Contract accepted; semantic use experimental and profile-specific |
| take | take-prefix | PASS | n/a | n/a | Deterministic behavior covered by native release CI |
| tree | tree-exact, tree-about, tree-describe | PASS | 6/6 | 4/6 | Contract accepted; semantic use experimental and profile-specific |
| unique | unique-key | PASS | n/a | n/a | Deterministic behavior covered by native release CI |

Stronger model evidence: [raw report](../evals/results/release/2026-09-20T14-51-55-840Z-google_gemma-4-e4b/report.json). Small model evidence: [raw report](../evals/results/release/2026-09-20T14-55-34-078Z-ribbit-release-small/report.json). Scores aggregate modes only for display; raw case verdicts remain authoritative. A failed mode is never waived by other passing cases.

## Management surfaces

Evidence: [packaged lifecycle tests](../tests/release/management.test.ts), [recipe tests](../tests/release/recipes.test.ts), and existing CLI/extension tests.

| Surface | Checked behavior | Verdict |
| --- | --- | --- |
| setup | Discovery returns versioned data, performs no download or config mutation | PASS in packaged tests |
| doctor | Configuration, picker presence, installed extension health, explicit model probe | PASS in packaged tests |
| providers | Add/list/remove and referenced-provider rejection | PASS in packaged tests |
| models | Explicit provider discovery against mock HTTP | PASS in packaged tests |
| profiles | Set/show/list/remove and route selection | PASS in packaged tests |
| route | Semantic model provenance and exact no-inference inspection | PASS in packaged tests |
| commands | List/describe every built-in; validate named definition | PASS in packaged tests |
| types | List and scoped contract description | PASS in packaged tests |
| extensions | Scaffold/check/test/add/list/remove; source preserved | PASS in packaged tests |
| run | Named defaults and invocation override | PASS in packaged tests |
| flow | Validate/plan/run; saved/inline/OS-pipe equivalence; routing and budget failure | PASS in packaged tests |
| init | Idempotent project/guidance initialization preserves owner text | PASS in packaged tests |
| completions | bash/zsh/fish include named definitions | PASS in packaged tests |

These are bounded acceptance cases, not exhaustive subcommand fuzzing. Real remote-provider conformance, independent user onboarding, and Windows interactive console behavior remain separate checks.
