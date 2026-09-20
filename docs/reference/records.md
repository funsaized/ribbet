# Records and formats

## Input modes

| `--input` | Interpretation |
| --- | --- |
| `auto` | Ordinary stdin is text; recognizes the versioned Ribbit record header |
| `text` | Text input |
| `lines` | One string value per line |
| `jsonl` | One JSON value per line |
| `records` | Requires the Ribbit wire header and valid records |

`--file PATH` and nonempty stdin are mutually exclusive. Filesystem discovery, `read`, and `compare` own explicit paths and reject piped input. Malformed JSON, invalid UTF-8, duplicate record IDs, and exceeded input limits fail explicitly.

## Record wire format

A stream begins with this exact JSON header followed by newline-delimited records:

```json
{"$ribbit":{"version":1,"kind":"records"}}
{"id":"1","value":{"ticket":"R1","body":"Checkout fails."},"annotations":{}}
```

| Field | Contract |
| --- | --- |
| `id` | Nonempty string, unique within the admitted stream |
| `value` | Finite JSON value |
| `source` | Optional object with `path`, positive `lineStart`, and positive `lineEnd` fields when known |
| `annotations` | Object mapping annotation names to finite JSON values |

Commands preserve, transform, or aggregate records according to their own contracts. An ID is an in-run identity, not a durable global identifier. A source path records where the input was read; copying the stream does not copy the source file.

## Output boundaries

Record-producing commands default to Ribbit records. `--output jsonl` exports bare values and drops IDs, sources, and annotations. `render` produces a final display/export representation. Keep records until the consumer no longer needs their metadata.

A JSON result from `extract` is not auto-detected as a record stream by the next shell process. If importing it into record-oriented rendering, use `render --input jsonl` explicitly.

stdout contains result data. stderr contains diagnostics and optional statistics. A later failure may follow an already-emitted valid prefix; inspect the exit status before accepting the whole result.

Related: [composition explanation](../explanation/composition.md), [runtime reference](runtime.md).
