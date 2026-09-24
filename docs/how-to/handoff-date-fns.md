# Prepare a date-fns contribution brief

The example uses date-fns commit `cd53d2538cfa318404eff7ade6449b49bf34562e`, with `parseISO` under `pkgs/core/src/parseISO/`. See the [pinned excerpts and MIT attribution](../../fixtures/tutorials/date-fns/PROVENANCE.md). Existing timezone and invalid-input tests are evidence, not proof of an upstream bug.

Install `ribbit` on PATH and configure the `local-small` profile using [model setup](configure-models.md). npm installs the executable, not these examples: clone the Ribbit repository at a reviewed revision for `examples/` and `fixtures/`. For a full contribution checkout also clone `https://github.com/date-fns/date-fns` and check out the SHA above; the bounded fixture below works offline. From the Ribbit checkout:

```sh
mkdir -p date-fns-brief/commands
cp -R fixtures/tutorials/date-fns/. date-fns-brief/
cp examples/commands/contribution-brief.yaml date-fns-brief/commands/
cp examples/flows/date-fns-context.yaml date-fns-brief/context.yaml
cd date-fns-brief
ribbit read AGENTS.md CONTRIBUTING.md pkgs/core/package.json pkgs/core/src/constants/index.ts \
  pkgs/core/src/parseISO/index.ts pkgs/core/src/parseISO/test.ts --output records > sources.records
```

**Expected output:** six records with path/content and source references. Check the exit code before treating the file as complete; inspect `parseISO/index.ts` and `test.ts` for timezone offsets, `additionalDigits`, invalid input, and existing coverage. `CONTRIBUTING.md` predates parts of the pinned monorepo; compare its advice with actual package scripts before running commands.

Turn the saved evidence into a brief:

```sh
ribbit run contribution-brief --input records --file sources.records --profile local-small > brief.txt
```

**Required properties:** public behavior/options, existing coverage, a cited proposal rather than an invented missing bug, maintainer questions, and verification commands backed by the checkout; separate observations, hypotheses and next checks. No live model transcript is asserted here. Keep `sources.records` alongside the brief so a maintainer can challenge interpretations.

The same steps are a reusable flow, run from the fixture directory:

```sh
ribbit flow plan context.yaml
ribbit flow run context.yaml > flow-brief.txt
```

**Expected output:** one exact `read` stage and a routed `contribution-brief` stage. **Required properties:** nonzero exit invalidates even a plausible partial output. In a pinned full checkout, `pkgs/core/package.json` supplies `pnpm --filter date-fns test` (Vitest) and `pnpm --filter date-fns lint`; check `pnpm-workspace.yaml` and `mise.toml` for current package tooling before proposing a change. To hand off to a coding harness, send the saved record file as UTF-8 stdin, require paths and line references, and configure that harness's permissions independently; Ribbit's model profile does not configure the harness.
