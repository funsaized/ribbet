# Execution and trust

Ribbit separates a command's data contract from the permissions of the code that executes it.

## Built-ins and model outputs

Built-in semantic commands send supplied evidence to an explicitly resolved model endpoint. Their outputs pass structural and command-specific checks. A rank must refer to admitted identities; a structured extraction must match its schema. These checks reject malformed results, not every incorrect interpretation.

Evidence may itself contain instructions. Treat it as untrusted input in downstream prompts, and keep original material available when review matters. Prompt injection is not solved by wrapping text in a record or validating JSON.

Built-ins do not execute model-proposed shell commands. A successful `ask` response is an answer, not an autonomous tool action.

## Local and remote routes

Local processing sends evidence to the local endpoint you configured. A remote profile sends evidence to its remote endpoint. A local preparation step does not change that later boundary. Ribbit has no automatic cloud fallback or telemetry.

Filesystem exclusions reduce accidental admission of common sensitive names. They do not inspect every secret format or guarantee that source content is safe to share. Review the admitted material before a remote handoff.

`find`/`tree` with content discovery or semantic selection exclude common sensitive-looking names even when hidden files or ignore rules are enabled, unless `--include-sensitive` is explicitly given. Names-only nonsemantic discovery and explicit-path `read`/`compare` remain intentional access paths. These exclusions are not secret scanning.

## Extensions and harnesses

An installed extension is trusted TypeScript code with filesystem, network, and process access. Its manifest describes effects; it does not enforce a sandbox. Checking, testing, and installing an extension can execute its source. Discovery and help inspect declarations without importing it.

An external harness has its own configuration, tools, and permissions. Ribbit's file/stdin handoff does not impose a sandbox on the receiver. The supplied local Codex example explicitly selects a read-only sandbox and asks for source interpretation; other harness invocations may do more.

Use [private vulnerability reporting](https://github.com/funsaized/ribbit/security/policy) for security defects. Use a sanitized fixture and model details when reporting an ordinary semantic error.
