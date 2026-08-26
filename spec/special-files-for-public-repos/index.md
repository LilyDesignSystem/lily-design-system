# Special files for public repos

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Every subproject in this monorepo is a `git subtree` pushed to its own
standalone **public repository**. Each of those repositories is the first and often
only thing a stranger sees, so each one needs the standard set of top-level files a
public repository is expected to carry — licence, citation, contribution route,
ownership, provenance — not just the monorepo root. This topic fixes that set, says
which files are copied and which are generated per subproject, and defines the
tooling that keeps them in sync.

## Scope

This topic covers the special top-level files for the repository root and for all
22 published repositories (21 implementation subprojects plus
`lilydesignsystem.github.io`), the copy-versus-generate decision per file, the
link-rewriting rule that makes a copied file correct in its destination, and the
`bin/sync-special-files` and `bin/test` enforcement.

It does **not** cover: the per-directory AI convention of `index.md`, `README.md`
symlink, `AGENTS.md`, `CLAUDE.md`, and `spec/index.md` (see
[architecture](../architecture/index.md)), the content of the specification itself,
or the publish pipeline (see [tooling](../tooling/index.md)).

## Principles and rules

- **A public repository with no `LICENSE` is "all rights reserved".** Default
  copyright applies to a repository that omits it, whatever the upstream monorepo
  says. This is the single reason this topic exists: 22 public repositories were
  shipping without one.
- **The root is canonical; subprojects receive copies.** Edit at the root and run
  `bin/sync-special-files`. Never hand-edit a synced copy — it will be overwritten.
  Each copy carries an HTML-comment provenance banner saying so.
- **Copies must be correct where they land.** A relative link that resolves at the
  root often does not resolve in a subproject, which has no `components.tsv`, no
  `themes/`, and no `bin/`. The sync rewrites any relative link whose target is
  absent in the destination into an absolute URL on the canonical repository, and
  leaves the rest relative.
- **Generate what genuinely differs.** `CITATION.cff` and `INSTALL.md` are
  per-subproject: a citation must name its own repository, and install instructions
  for a Blazor Razor class library have nothing in common with a Nunjucks macro
  catalog. Everything else is identical across repositories, and identical files
  should be identical rather than lovingly diverged.
- **Never fabricate history.** A subproject without its own `CHANGELOG.md` gets a
  stub that points at the canonical changelog, not an invented one.
- **`README.md` stays a symlink to `index.md`.** That is the repository-wide
  convention and `bin/test` enforces it; the sync must not replace it with a file.
- **Copies are not published artifacts.** These files are documentation, so they
  are excluded from npm `files` allowlists and NuGet `Content` where those already
  exclude documentation.

## The file set

| File | Mode | Notes |
| --- | --- | --- |
| `README.md` | local | Symlink to `index.md`; already present everywhere; untouched by the sync |
| `LICENSE.md` | copy | SPDX expression + trademark note. **The reason this topic exists** |
| `CITATION.cff` | generate | Per-repository title, abstract, and `repository-code`; shared author and ORCID |
| `NEWS.md` | copy | News, release highlights, press contacts, boilerplate |
| `COMPARISONS.md` | copy | Positioning against other design systems, with honest limitations |
| `BENCHMARKS.md` | copy | Measured package sizes and test scale; states plainly that no runtime benchmarks exist |
| `INSTALL.md` | generate | Per-framework install and usage; the file that most needs to differ |
| `CONTRIBUTING.md` | copy | Time, code, and money |
| `CODEOWNERS` | copy | `@joelparkerhenderson` and <joel@joelparkerhenderson.com> |
| `MAINTAINERS.md` | copy | Roster and the bus-factor-of-one continuity statement |
| `CHANGELOG.md` | local, else stub | 10 subprojects have real ones; the rest get a pointer |
| `AI_STATEMENT.md` | copy | Disclosure of AI use in development |
| `GOVERNANCE.md` | copy | Who decides, where decisions are recorded, what the project will not do |
| `SECURITY.md` | copy | Supported versions, reporting route, scope and non-scope |
| `CODE_OF_CONDUCT.md` | copy | Required: `CONTRIBUTING.md` links to it |
| `RFC.md` | copy | Open questions the project wants answered |

`AI_STATEMENT.md` in this directory is the **project-agnostic template** — the
reusable form, with no Lily-specific content. The root `AI_STATEMENT.md` is Lily's
instantiation of it, and is what the sync distributes.

`CODE_OF_CONDUCT.md`, `RFC.md`, `GOVERNANCE.md`, and `SECURITY.md` are part of the
set alongside the original list: `CODE_OF_CONDUCT.md` because `CONTRIBUTING.md`
links to it and a dangling link in 22 repositories is worse than an extra file, and
the other three because they are root special files with the same
canonical-and-copy shape as the rest. `SECURITY.md` matters most of the four to a
repository read on its own: a public repo with no reporting route gets its
vulnerabilities filed as public issues.

## Link rewriting

For every copied file, each markdown link target that is relative (not `http`,
`mailto:`, or a bare `#anchor`) is tested against the destination directory:

| Condition | Result |
| --- | --- |
| Target exists in the destination subproject | Left relative |
| Target is missing, and names a file | `https://github.com/LilyDesignSystem/lily-design-system/blob/main/{target}` |
| Target is missing, and names a directory | `https://github.com/LilyDesignSystem/lily-design-system/tree/main/{target}` |

So a link whose target is `spec/index.md` stays relative in a headless subproject,
which has its own `spec/index.md`, while a link to the catalog TSV becomes an
absolute link on the canonical repository, which is the only place that file exists.

## Tooling

| Script | Purpose |
| --- | --- |
| [`bin/sync-special-files`](../../bin/sync-special-files) | Propagate the set into all 22 public repositories, rewriting links and generating the per-subproject files |
| [`bin/test`](../../bin/test) | Verify the set is present and non-empty in the root and every subproject |
| [`bin/check-links`](../../bin/check-links) | Verify every rewritten relative link still resolves |

`bin/sync-special-files` is idempotent: running it twice produces no diff. Run it
after editing any canonical file, and before `bin/git-subtree-push`.

## Acceptance criteria

- [x] The repository root carries all 16 files in the table.
- [x] `LICENSE.md` states one SPDX expression, and it matches every package
      manifest and [spec/index.md](../index.md) §14.
- [x] All 22 public repositories carry the full set.
- [x] Every subproject `CITATION.cff` names its own repository and parses as valid
      YAML against CFF 1.2.0.
- [x] Every subproject `INSTALL.md` documents that subproject's own install path,
      and states honestly whether it is published to a registry.
- [x] No copied file contains a relative link that fails to resolve in its
      destination; `bin/check-links` passes.
- [x] `README.md` remains a symlink to `index.md` in every subproject.
- [x] `bin/sync-special-files` is idempotent.
- [x] `bin/test` fails when any file in the set is missing or empty.

## Related topics

- [architecture](../architecture/index.md) — the subtree model that makes each subproject a public repo.
- [tooling](../tooling/index.md) — the `bin/` scripts, including the sync model.
- [trademarks](../trademarks.md) — the ™ convention every distributed file follows.
- [helpers](../helpers/index.md) — the helper catalogs, whose `AGENTS/` the ordinary `bin/sync` deliberately skips.

## Sources

- [LICENSE.md](../../LICENSE.md), [GOVERNANCE.md](../../GOVERNANCE.md), [SECURITY.md](../../SECURITY.md), [CITATION.cff](../../CITATION.cff), [CONTRIBUTING.md](../../CONTRIBUTING.md), [MAINTAINERS.md](../../MAINTAINERS.md), [AI_STATEMENT.md](../../AI_STATEMENT.md), [RFC.md](../../RFC.md), [NEWS.md](../../NEWS.md), [COMPARISONS.md](../../COMPARISONS.md), [BENCHMARKS.md](../../BENCHMARKS.md), [INSTALL.md](../../INSTALL.md), [CODEOWNERS](../../CODEOWNERS), [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md), [CHANGELOG.md](../../CHANGELOG.md)
- [AI_STATEMENT.md](AI_STATEMENT.md) — the project-agnostic template
- [bin/sync-special-files](../../bin/sync-special-files), [bin/test](../../bin/test), [bin/check-links](../../bin/check-links)

---

Lily™ and Lily Design System™ are trademarks.
