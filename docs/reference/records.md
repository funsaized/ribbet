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

## Field addressing and preservation

Plain `body` still means `record.value.body`. On record input, `$.id`, `$.source.path`, `$.annotations.category.label`, `$.value` and `$` address the envelope, source, annotations, entire value, and entire envelope respectively. Quote dollar paths in the shell: `ribbit where '$.annotations.category.label' --args-json '{"equals":"actionable"}'`. Flow `$ref` bindings are unrelated to field addressing. Non-record `render` templates only support plain value fields. Missing fields error by default; explicit JSON null is a value, not a missing field.

`select 'body,label=$.annotations.category.label'` projects into value fields. Each envelope source requires an explicit ordinary destination, including `snapshot=$`. Whitespace around commas and aliases is ignored. Empty paths, extra `=`, unsafe prototype names, duplicate destinations, overlapping paths and conflicting array/object containers are rejected **before** input consumption; formerly order-dependent ambiguous projections are no longer supported. Arrays retain bounded indices and null-filled gaps. Projection copies are byte-bounded and never silently duplicate the envelope. `--missing null` substitutes null for missing lookups.

`where FIELD --args-json '{"equals":1}'` matches exact scalar equality without coercion: `1` differs from `"1"`, null only matches explicit null, and a missing field errors. It streams complete retained records in order and can emit an empty stream without model calls. In flows pass native typed `field` and `equals` arguments.

| Operation | Preservation boundary |
| --- | --- |
| `filter`, `where`, `take`, `unique`, `rank`, `sort` | Complete retained originals, though selection/order can change |
| `select` | Replaces value with projection, retains ID/source/annotations |
| `classify` | Retains evidence; replaces chosen annotation with `{label}` |
| default `map` | Replaces value; updates `map.originId`, not a copy of old value |
| `map --annotate NAME` | Retains evidence; replaces only the chosen annotation with the validated result |
| `group` | Complete originals nested in `value.members` |
| `reduce`, display, bare-value exports | Evidence/metadata boundary; retain upstream artifacts separately |

Named `classify --annotation-key NAME` defaults to `classify`. Custom names are single safe path identifiers; `classify`, `map`, `group`, and `tree` are built-in namespaces (only classify may use its own default). A chosen custom name replaces the **whole** existing annotation value; different names coexist. Schema validation checks structure, not the factual truth of a model answer.

## Output boundaries

Record-producing commands default to Ribbit records. `--output jsonl` exports bare values and drops IDs, sources, and annotations. `render` produces a final display/export representation. Keep records until the consumer no longer needs their metadata.

A JSON result from `extract` is not auto-detected as a record stream by the next shell process. If importing it into record-oriented rendering, use `render --input jsonl` explicitly.

stdout contains result data. stderr contains diagnostics and optional statistics. A later failure may follow an already-emitted valid prefix; inspect the exit status before accepting the whole result.

Related: [composition explanation](../explanation/composition.md), [runtime reference](runtime.md).
