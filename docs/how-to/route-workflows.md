# Route a mixed-model workflow

Use an existing `local-small` profile for a bounded intermediate task and a `stronger` profile for synthesis. Configure them with [model setup](configure-models.md).

## Set routes on saved steps

The [triage flow](../../examples/flows/triage.yaml) declares `inference.profile: local-small` on classification and `inference.profile: stronger` on reduction. Its exact `select` step needs no model.

From a checkout or extracted native archive, inspect the plan before running it:

```sh
ribbit flow plan examples/flows/triage.yaml
ribbit flow run examples/flows/triage.yaml \
  --file fixtures/release/feedback.jsonl --input jsonl --stats
```

Read the plan and reported routes to confirm the intended provider/model choices. The [triage guide](triage-feedback.md) describes the expected evidence and result.

## Set routes in an inline flow

```sh
ribbit flow run --file fixtures/release/feedback.jsonl --input jsonl -- \
  classify --field body \
    --label 'blocking=Prevents purchases' --label 'other=Other feedback' \
    --profile local-small :: \
  reduce 'Summarize every ticket and cite its ID; verify labels against original bodies.' \
    --profile stronger
```

A flow-level `--profile` supplies a default. More specific definitions and step settings can override it. To replace managed routes across the whole flow for a controlled comparison, use `--force-profile`:

```sh
ribbit flow run examples/flows/triage.yaml \
  --file fixtures/release/feedback.jsonl --input jsonl --force-profile stronger --stats
```

This routes both semantic steps to `stronger`; it does not change the exact step or remove the classification stage. A direct stronger-model baseline is a separate single-command request, not merely a forced profile.

## Compare with one stronger-model call

```sh
ribbit reduce \
  'Prioritize all tickets. Cite every ticket ID and preserve accessibility failures. Separate observations from hypotheses.' \
  --file fixtures/release/feedback.jsonl --input jsonl --profile stronger --stats
```

Check the same final facts in both results, then compare total elapsed time and requests. Unknown token usage is not zero. The supplied fixtures do not establish a speed or cost advantage for chaining; see [when to chain models](../explanation/model-chaining.md).
