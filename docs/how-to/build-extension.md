# Add a typed extension

Use an extension when the built-ins cannot express the executable behavior you need. Installed extensions are trusted code, so review the source before checking, testing, or installing it.

## Scaffold and verify

```sh
ribbit extensions scaffold extensions/greeting
ribbit extensions check extensions/greeting
ribbit extensions test extensions/greeting
```

The scaffold supplies TypeScript source, dependency declarations, and a deterministic fixture. Check and test must succeed before installation. Edit the source and fixtures together for your own behavior.

## Install and name it

```sh
ribbit extensions add extensions/greeting
ribbit types describe @local/greeting --json
```

Create `commands/greeting.yaml`:

```yaml
apiVersion: ribbit/v1
kind: Command
name: greeting
type: '@local/greeting'
typeVersion: '1.0.0'
action: run
config:
  prefix: 'Hello '
defaults:
  suffix: '!'
```

Validate the definition, then invoke it:

```sh
ribbit commands validate greeting
printf 'Ada' | ribbit run greeting
```

The scaffold should return `Hello Ada!`. Inspect the actual scaffold if you have edited its defaults or behavior.

After a source change, repeat check, test, and add explicitly. Discovery and help read declarations; they do not rebuild your source automatically. Removing the installed extension preserves its source directory.

## Start from a worked example

[GitHub PR evidence](../../examples/extensions/gh-evidence/README.md) is a complete read-only extension that gathers bounded pull-request, discussion, changed-file, and check evidence through a fixed allowlist of `gh` calls, and replays saved JSON bundles offline. Review its source, then follow the same check → test → add → name sequence.

For schemas, modes, bindings, and managed inference APIs, use the [extension reference](../extensions.md). For the trust boundary, read [execution and trust](../explanation/trust.md).
