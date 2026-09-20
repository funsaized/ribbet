# Triage feedback without dropping tickets

Use the supplied flow when a local model should annotate feedback and a stronger model should review all the original bodies.

You need installed Ribbit, configured `local-small` and `stronger` profiles, and the example files. If you installed through npm, get them with Git:

```sh
git clone https://github.com/funsaized/ribbet.git ribbit-examples
cd ribbit-examples
```

The native archive already includes `examples/` and `fixtures/`; run from its extracted root instead if you use that distribution.

## Check and run the example

```sh
ribbit flow validate examples/flows/triage.yaml
ribbit flow plan examples/flows/triage.yaml
ribbit flow run examples/flows/triage.yaml \
  --file fixtures/release/feedback.jsonl --input jsonl --stats
```

The final answer must cite R1, R2, and R3, distinguish the cosmetic report, and preserve R3's accessibility failure. Do not accept invented owners, deadlines, or revenue figures. All three original ticket bodies reach the reducer; local labels are suggestions.

## Use your feedback

Prepare UTF-8 JSONL with `ticket`, `body`, and `component` fields. Copy the [flow](../../examples/flows/triage.yaml) to your project, adjust the labels and synthesis instruction for your task, then validate again. Keep the identifier field in the first `select` step and in the reducer's citation instruction.

```sh
ribbit flow run triage.yaml --file YOUR_FEEDBACK.jsonl --input jsonl \
  --max-records 100 --max-requests 110 --stats
```

Those are explicit job bounds, not a model context guarantee. Start with a small batch and verify how many model requests it needs before raising them. Record-wise classification and final synthesis share the flow budget.

Preserve originals when false negatives would matter. To understand why this example classifies instead of filters, read [the recipe explanation](../explanation/recipes.md#feedback-triage).
