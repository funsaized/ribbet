# Filesystem and exact-command audit

Audited working-tree source at HEAD `fad96c5ceaaab68fbdd06bbd5ef698c1e83fbc6f` on 2026-09-13, Bun 1.4.0. This is a separate implementation audit performed after the public-only consumer and blind-label evaluations were complete. No repository files changed and no model calls made.

Runtime reproduction: `bun /tmp/ribbit-fs-audit.ts`. The complete standalone script remains at that path and exact JSON results at `/tmp/ribbit-fs-audit-results.jsonl`. It creates and removes its own temporary fixtures. Exit 0 means the script captured all outcomes, not that the requirements passed.

Focused suite: `bun test tests/filesystem tests/builtins tests/execution`, exit 0, 16 pass / 0 fail / 56 assertions. Full output: `/tmp/ribbit-fs-audit-tests.txt`.

## Confirmed defects

1. **Table headers bypass control-character escaping (CMD-07).** `src/builtins/exact.ts:22` joins original object keys without using the escape helper used for cells. Rendering `{"name\u001b[31m":"safe"}` as a table returns a raw ESC sequence in the header. Tabs/newlines in keys likewise alter the table structure. Escape column labels too; preserve original keys only for lookup. Add header and cell controls tests, while checking JSON retains original values.

2. **Opt-in skip mode aborts on unreadable subdirectories (FS-01, FS-04).** `src/filesystem/index.ts:18,20,37` handles neither ignore-file reads nor directory reads through the skip policy. A `chmod 000` subdirectory makes `walk(root,{recursive:true,onReadError:'skip'})` throw code 7 `Filesystem traversal failed` instead of continuing with warnings and an omission count. Reproduced as the ordinary workstation user. Root-open failures can remain fatal, but nested failures should follow the documented discovery policy.

3. **Explicit UTF-8 text loses a leading BOM (FS-02).** `src/builtins/primitives.ts:22` uses TextDecoder's default BOM stripping. Bytes `EF BB BF 41` return `A`, not `\ufeffA`. This violates the task's exact-content preservation requirement and also makes content-byte accounting undercount the bytes read. Decide the public BOM policy explicitly; exact preservation requires decoding with BOM retention. Test multiple file boundaries and byte limits with BOM inputs.

4. **Documented field grammar differs from actual helpers (CMD-06, CMD-07).** Contract permits hyphens and restricts first character to letter/underscore. `pathParts` at `src/builtins/primitives.ts:5-6` rejects `some-key` with code 2 and instead permits `$`. This affects select/sort/unique/template lookup. Align the parser with the ratified grammar and use shared path tests across flow references and exact commands.

5. **Text display does not escape terminal controls (CMD-07 task requirement).** `src/builtins/exact.ts:19` returns `\u001b[31mRED` as a raw ESC sequence. Template substitutions also return raw strings. The task says to escape terminal controls in display modes, while the contract's implementation note specifically promises table escaping. Resolve that scope discrepancy explicitly; at minimum the confirmed table-header defect is unambiguous. Preserve machine JSON/JSONL separately from display escaping.

## Static concerns requiring focused acceptance evidence

- **Ignore reads bypass both root and byte protections.** `src/filesystem/index.ts:18` follows `.gitignore` / `.ribbitignore` symlinks via unbounded `readFile`; it does not check their real paths against the traversal root or enforce a size limit. `readdir` also materializes and sorts the entire directory before maxFiles is checked. The content reader itself has a sound pre-stat plus growing-read byte check, but these auxiliary reads do not share it. Add outside-root ignore-link, large-ignore, and wide-directory tests, with an explicit boundedness policy.
- **Huge projection indices allocate before output budgets.** `assign` in `src/builtins/exact.ts:7` fills arrays with null up to the requested numeric index. `select 'a[1000000000]' --missing null` on `{}` can perform enormous work before output validation. The path parser does not cap numeric indices or require safe integers. Reject impossible/out-of-budget projections before dense expansion; test finite failure without allocating a giant fixture.
- **Picker validates and yields incrementally.** `src/builtins/filesystem.ts` yields each backend-selected record before validating subsequent tokens. A backend response with one valid token followed by an invalid/duplicate token can emit partial data before error. Valid selections cannot fabricate records, but all-or-nothing validation needs a test and likely a validate-first pass. The real PTY script tests single selection and Escape; it does not cover actual multiselect, unknown/duplicate backend IDs, missing backend, bad versions, or hostile FZF environment configuration. Do not promote the existing smoke result into full FS-05 acceptance.
- **Template reads use a fixed default rather than invocation maxBytes.** `textFile(args.template)` reads up to 8 MiB regardless of a smaller command budget; templates and rendered strings are fully materialized before output accounting. Test large templates with small invocation budgets and expansion across many rows.

## Acceptance assessment

FS-01 needs unreadable-directory policy repair plus outside-root, permission, exact byte-boundary, ignore precedence/negation, and directory-width evidence. The current filesystem test covers nested simple ignores, hidden/sensitive filtering, NUL binary omission, a cycle, and a small maxFiles failure; it is not the complete requested matrix.

FS-02 needs exact BOM behavior and explicit multifile identity/order/content, binary failure and zero-provider pipeline evidence. Implementation assigns sequential IDs and absolute source paths and preserves requested path order; those details should be documented and checked.

FS-03/04 have useful static safeguards: actual walker records provide candidates, find selections validate IDs before returning original records, descriptions require a complete unique ID set, and ancestor reconstruction uses actual paths. Missing acceptance evidence includes captured names/content payloads, ignored-candidate absence, rejected invented IDs, inference not called after traversal-budget failure, tree depth and ancestor goldens, and omission behavior. These can use deterministic mocks and must remain distinct from live quality evidence.

FS-05 should remain REVIEW pending the expanded PTY/backend matrix above. The code uses argv, NUL transport and control-escaped labels and clears the primary FZF default options; these are positive safeguards, not complete acceptance evidence.

CMD-06 has passing small-case stable sort, first canonical unique, mixed-type rejection, and take-zero/no-extra-pull tests. The specified property tests and 100k stream evidence are not present in the inspected tests. Also verify identity/source/annotations across each operation, huge-index rejection and unique memory accounting.

CMD-07 should remain REVIEW until header escaping and field grammar are fixed and the text-display policy reconciled. Existing tests show literal shell-looking text is not executed and constructor access fails; missing-placeholder errors, empty table, Unicode widths, nested JSON round trips and control-bearing keys need dedicated evidence.

No claim here treats static inspection as runtime proof. The five confirmed cases are runtime reproductions against source; the subsequent concerns are explicitly static and recommendations.
