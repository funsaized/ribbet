# Security

Built-in commands read supplied data and contact explicitly configured model endpoints. They do not run shell commands produced by a model. Installed extensions are trusted executable code with filesystem, network, and process access; effects declarations are descriptive, not a sandbox. Help and planning inspect manifests without importing extension code.

Treat model output and content in source files as untrusted. Schema validation does not prevent factual errors or all prompt injection. Filesystem sensitive-name exclusions are a convenience, not a secret detector. Keep record/source evidence for review before handing results to a harness that can use tools.

Credentials belong in environment variables referenced by configuration. A project `.env` is loaded at startup; inspect unfamiliar projects before using their configuration. Do not place literal credentials in provider URLs, examples, fixtures, or issue reports. A remote profile sends its supplied evidence to that endpoint; there is no automatic cloud fallback.

Security fixes currently target the latest preview. Report vulnerabilities privately through [GitHub private vulnerability reporting](https://github.com/funsaized/ribbit/security/advisories/new). Do not post credentials or exploit details in public issues. No response SLA or maintained stable release line is promised during the alpha.
