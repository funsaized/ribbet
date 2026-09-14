# CMD-02 — ACCEPTED 2026-09-14

| Criterion | Result | Evidence |
| --- | --- | --- |
| Invalid/unsupported schema fails before inference | PASS | `tests/providers/managed.test.ts` schemaToJson; extract file schema |
| No invented class | PASS | classify invented label rejected |
| Repaired responses counted | PASS | managed repair test `llm.repairs===1` |
| Output never emits invalid schema | PASS | object parse/repair then fail |

Reviewer decision: ACCEPTED. Live extract/classify scores remain EVAL-02.
