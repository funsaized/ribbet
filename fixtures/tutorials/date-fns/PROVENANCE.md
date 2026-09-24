# Provenance: date-fns contribution-brief fixtures

These files are bounded excerpts from the [date-fns](https://github.com/date-fns/date-fns)
repository, kept in the repository so the contribution-brief tutorial and its
tests run offline. They are redistributed under date-fns' MIT license; the
license text is in [LICENSE.md](LICENSE.md).

## Pinned revision

| Field | Value |
| --- | --- |
| Repository | `https://github.com/date-fns/date-fns` |
| Commit | `cd53d2538cfa318404eff7ade6449b49bf34562e` |
| Short commit | `cd53d25` |
| Commit subject | `Promote to v4.4.0` |
| Retrieved | 2026-09-24 |
| License | MIT, declared in `pkgs/core/package.json` and `pkgs/core/LICENSE.md` |
| Copyright | Copyright (c) 2021 Sasha Koss and Lesha Koss |

The pinned layout is `pkgs/core/src/parseISO/`, not a root `src/parseISO/`.
Confirm the same revision with:

```sh
git clone https://github.com/date-fns/date-fns.git date-fns
cd date-fns
git checkout cd53d2538cfa318404eff7ade6449b49bf34562e
ls pkgs/core/src/parseISO
```

## Files and source commands

Each file below was read from the pinned revision with `git show`. Files marked
*excerpt* keep the named sections verbatim and omit the rest; nothing is
paraphrased.

| Fixture path | Source path | Form | Source command |
| --- | --- | --- | --- |
| `AGENTS.md` | `AGENTS.md` | full | `git show cd53d2538cfa318404eff7ade6449b49bf34562e:AGENTS.md` |
| `CONTRIBUTING.md` | `CONTRIBUTING.md` | full | `git show cd53d2538cfa318404eff7ade6449b49bf34562e:CONTRIBUTING.md` |
| `LICENSE.md` | `pkgs/core/LICENSE.md` | full | `git show cd53d2538cfa318404eff7ade6449b49bf34562e:pkgs/core/LICENSE.md` |
| `pkgs/core/package.json` | `pkgs/core/package.json` | excerpt | `git show cd53d2538cfa318404eff7ade6449b49bf34562e:pkgs/core/package.json` |
| `pkgs/core/src/constants/index.ts` | `pkgs/core/src/constants/index.ts` | excerpt | `git show cd53d2538cfa318404eff7ade6449b49bf34562e:pkgs/core/src/constants/index.ts` |
| `pkgs/core/src/parseISO/index.ts` | `pkgs/core/src/parseISO/index.ts` | full | `git show cd53d2538cfa318404eff7ade6449b49bf34562e:pkgs/core/src/parseISO/index.ts` |
| `pkgs/core/src/parseISO/test.ts` | `pkgs/core/src/parseISO/test.ts` | full | `git show cd53d2538cfa318404eff7ade6449b49bf34562e:pkgs/core/src/parseISO/test.ts` |

Excerpt boundaries:

- `pkgs/core/package.json` retains the package identity, license, module
  fields, and `scripts`. The omitted `exports` map is large generated wiring
  that does not change the contribution brief.
- `pkgs/core/src/constants/index.ts` retains only the millisecond constants
  imported by `parseISO`.

## Redistribution

date-fns is MIT licensed, so verbatim excerpts are permitted when the license
and copyright notice travel with them. `LICENSE.md` is included for that
reason. Do not remove the headers or this provenance file when copying the
fixtures elsewhere. The retrieval date and commit are recorded above; re-run
the `git show` commands to compare against the upstream revision.
