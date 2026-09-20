# Limits, errors, and statistics

## Default invocation limits

| Limit | Semantic invocation | Exact input |
| --- | --- | --- |
| Input bytes | 8 MiB | 128 MiB |
| Records | 10,000 | 1,000,000 |
| Global rank/group candidates | 200 | Not applicable |
| Filesystem entries inspected by default | 100 | Command-specific traversal bound |
| Request time | 60 seconds | No inference |
| Total time | 120 seconds | See command execution contract |
| Model requests | 32 | Zero |
| Aggregate reported tokens | 64,000 | Zero |

Finite overrides are `--max-bytes`, `--max-records`, `--max-requests`, `--max-tokens`, `--request-ms`, and `--total-ms`. Command-specific traversal flags remain separate. These bounds are not a guarantee that input fits a model's context window.

A flow shares invocation budgets and accounts for outputs cumulatively. Separate shell processes own separate budgets. Structured output allows at most one repair; repairs and retries share the invocation budget. Missing provider token usage is reported as unknown, not zero. Per-request output-token allowances belong in the route/profile's `maxOutputTokens` setting.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Success, including handled downstream pipe closure |
| 2 | Invalid arguments, input, definition, or flow |
| 3 | Route, provider, or configuration failure |
| 4 | Invalid semantic result |
| 5 | Extension execution failure |
| 6 | Budget exceeded |
| 7 | Filesystem, terminal, or output failure |
| 130 | Cancellation |

`--error-format json` selects versioned JSON diagnostics on stderr. Default diagnostics are text. stdout remains the result channel. Streaming output emitted before an error is only a valid prefix, not proof of a complete result.

## Statistics

`--stats` writes a JSON statistics object to stderr. It includes request, repair, retry, route, token, and elapsed-time information. Exact commands make zero model requests. Token values may be unknown when the provider does not supply usage.

Use [troubleshooting](../how-to/troubleshoot.md) for a procedure to capture and interpret a failing invocation.
