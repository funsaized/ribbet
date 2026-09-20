# Your first pipeline

We will sort a few tickets, keep the most urgent one, and return just the fields we need. Then we will run the same work as a flow. No model or provider is involved.

Before starting, [install Ribbit](../installation.md). These commands use Bash on Linux/macOS or Git Bash on Windows. Save files as UTF-8. Start in an empty working directory.

## Create three records

```sh
cat > tickets.jsonl <<'JSONL'
{"ticket":"R1","priority":3,"body":"Checkout fails."}
{"ticket":"R2","priority":1,"body":"A spelling mistake."}
{"ticket":"R3","priority":2,"body":"Keyboard checkout is blocked."}
JSONL
```

Read the first two lines as JSON values:

```sh
ribbit take 2 --file tickets.jsonl --input jsonl --output jsonl
```

Expected output:

```json
{"ticket":"R1","priority":3,"body":"Checkout fails."}
{"ticket":"R2","priority":1,"body":"A spelling mistake."}
```

`--input jsonl` tells Ribbit that each line is one record. `--output jsonl` gives us ordinary JSON values to inspect.

## Build a pipe

```sh
ribbit sort --by priority --type number --descending \
  --file tickets.jsonl --input jsonl |
  ribbit take 1 |
  ribbit select ticket,body --output jsonl
```

Expected output:

```json
{"ticket":"R1","body":"Checkout fails."}
```

The sort uses the numeric priority we supplied. It does not infer urgency from the text. The intermediate commands keep Ribbit records; only the last command exports bare values.

Change `take 1` to `take 2` and run the pipeline again. R3 should appear after R1. You have changed the amount of output without changing the input file.

## Run the same work as a flow

```sh
ribbit flow run --file tickets.jsonl --input jsonl --output jsonl -- \
  sort --by priority --type number --descending :: \
  take 1 :: select ticket,body
```

You should get the same R1 output. The `::` tokens separate command steps inside a single Ribbit process.

Run it once more with `--stats` before `--`. The JSON result still goes to stdout; the statistics go to stderr and report zero inference requests.

You now have a pipeline you can change one step at a time. Continue with [a local model](local-model.md), or read [how records and pipes compose](../explanation/composition.md).
