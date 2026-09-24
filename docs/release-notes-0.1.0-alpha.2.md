# Ribbit 0.1.0-alpha.2

Model tasks that work like commands. This alpha adds exact typed `where`, safe envelope lookups such as `$.annotations.classify.label`, explicit projection aliases, and named classify/map annotations. Wire records remain version 1. Content discovery now excludes sensitive-looking names unless explicitly opted in.

Three [evidence-based guides](recipes.md) investigate a pinned failing CI check, prepare a date-fns contribution brief, and analyze a bounded Squirrel Census sample. A cloneable [read-only GitHub PR extension](../examples/extensions/gh-evidence/README.md) acquires bounded evidence and replays saved JSON offline. Captured failure logs and pinned source excerpts are evidence; model responses are not deterministic or guaranteed factual.

## Install

```sh
npm install -g @funsaized/ribbit@alpha
ribbit --version
```

The npmjs package and optional GitHub Packages mirror use matching checksum-pinned native archives from this version's [GitHub release](https://github.com/funsaized/ribbit/releases/tag/v0.1.0-alpha.2) once published. npm needs Node.js >=20 and tar; native archives can be installed without Node.js. See [installation](installation.md) for the authenticated GitHub Packages registry. No model weights are included. Linux, macOS and Windows on x64/ARM64 are tested natively; Windows interactive picker behavior remains separately documented.

This is a prerelease, not a promise that model answers are correct or that chaining is cheaper or faster. Keep source records where a downstream model must be challenged. Extensions are trusted code. GitHub Packages may require an authenticated token even when a package is made public.
