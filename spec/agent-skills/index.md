# Agent skills

## Summary

Two repository top-level [Claude Skill](https://code.claude.com/docs/en/skills)
packages give AI coding agents a curated, loadable entry point into Lily
Design System: [`lily-skill`](../../lily-skill/) for people building *with*
the system, and [`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/)
for people working *on* this monorepo.

## Scope

### In scope

- `lily-skill` — general-purpose: concepts, terminology, naming
  conventions, composition patterns, and framework choice, for end users
  and consumers of Lily Design System.
- `lily-design-system-maintainer-skill` — technical: the required-files
  layout, the `bin/` tooling, the spec-driven workflow, and pointers into
  the binding `AGENTS/*.md` design-principle rules, for people maintaining
  this monorepo.
- Each skill's own `SKILL.md` (the Claude Skill entry point: YAML
  frontmatter with `name`/`description`/`license`, then Markdown
  instructions) and any `reference/*.md` files it loads on demand.

### Explicitly out of scope

- Restating the `AGENTS/*.md` design-principle rules or the `spec/`
  topic docs in full — both skills point at the canonical files rather
  than duplicating them, so those files stay the single source of truth.
- A third, framework-specific skill — the two above are deliberately the
  whole set; a framework question is answered by pointing into that
  framework's own subproject docs, not by a new skill package.

## Principles and rules

- **Two skills, two audiences.** `lily-skill` is portable — useful in any
  project that consumes Lily Design System, not just this monorepo.
  `lily-design-system-maintainer-skill` is bound to this repository's own
  tooling and conventions and is not useful anywhere else.
- **The naming prefix decides subproject treatment.** Only directory
  names starting with the `lily-design-system-` prefix are swept up by
  `bin/list-implementations` and `bin/sync-special-files` as
  implementation subprojects, held to the full required-files bar
  (`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`,
  `spec/index.md`, the 14 special files, `.git-subtree-push`). `lily-skill`
  deliberately sits outside that prefix, so it carries only `SKILL.md` +
  `README.md` (symlink) + `reference/`; `lily-design-system-maintainer-skill`
  carries the full set, per [architecture](../architecture/index.md) and
  [special-files-for-public-repos](../special-files-for-public-repos/index.md).
- **Content, not code.** Neither skill folder ships components, tests, or
  a build step — a skill package is documentation for an AI agent, so
  `bin/test`'s per-framework checks (Storybook, vitest, Playwright) don't
  apply to it.
- **`SKILL.md` is the entry point, `index.md` is the human overview.**
  Where both exist (in the full-subproject skill), `index.md` explains
  what the package is for a person browsing the repo; `SKILL.md` is what
  an agent actually loads.

## Detail sections

### Original directive

The two skills were commissioned with this brief (kept verbatim as the
record of intent):

> Create repository top-level agent skills folders:
>
> - `lily-skill` -> general-purpose skill for end users, about concepts,
>   ideas, terminology, examples from this repo.
> - `lily-design-system-maintainer-skill` -> technical implementation
>   skill for maintainers working on this repository
>
> Commit each skill separately.

### File shape by skill

| File | `lily-skill` | `lily-design-system-maintainer-skill` |
| --- | --- | --- |
| `SKILL.md` | yes | yes |
| `README.md` (symlink) | → `SKILL.md` | → `index.md` |
| `index.md` | — | yes |
| `AGENTS.md` / `CLAUDE.md` | — | yes |
| `spec/index.md` | — | this file's sibling |
| 14 special files + `.git-subtree-push` | — | yes, via `bin/sync-special-files` |
| `reference/*.md` | yes (naming-and-catalog, composition-patterns) | — |

### Tooling touched

`bin/list-implementations`'s glob was tightened from `lily-*` to
`lily-design-system-*` when `lily-skill` was added, so a future top-level
`lily-*` package that isn't an implementation subproject doesn't get
swept into `bin/test`'s full-subproject checks by name collision alone.
`bin/sync-special-files` gained a `"skill"` kind (matched by a `-skill`
suffix) so its generated `INSTALL.md`/`CITATION.cff` describe a skill
package accurately instead of assuming an npm/dotnet-run application.

## Acceptance criteria

- [x] Both skill folders exist at the repository root.
- [x] Each has a `SKILL.md` with `name` + `description` frontmatter
      naming concrete trigger phrases.
- [x] `lily-design-system-maintainer-skill` carries the full
      required-files set and passes `bin/test`.
- [x] `lily-skill` is excluded from `bin/list-implementations` and
      `bin/test`'s full-subproject checks (verified: tightening the glob
      changed zero existing subproject output).
- [x] `bin/sync-special-files`'s generated files for
      `lily-design-system-maintainer-skill` describe it as a Claude
      Skill, not an application (verified: the other 20 subprojects'
      generated output is unchanged).
- [x] Each skill was committed separately.
- [x] This topic is linked from [spec/index.md](../index.md)'s topic
      table.
- [ ] A real `.git-subtree-push` remote is configured for
      `lily-design-system-maintainer-skill` and the first push has
      happened — not done as of 2026-08-30.

## Related topics

- [architecture](../architecture/index.md) — the monorepo layout and the
  required-files convention the maintainer skill follows.
- [llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md) — the
  other AI-guidance file pair this same work session added.
- [special-files-for-public-repos](../special-files-for-public-repos/index.md) —
  the 14-file contract `lily-design-system-maintainer-skill` carries.

## Sources

- [`lily-skill/SKILL.md`](../../lily-skill/SKILL.md)
- [`lily-design-system-maintainer-skill/SKILL.md`](../../lily-design-system-maintainer-skill/SKILL.md)
- [`bin/list-implementations`](../../bin/list-implementations)
- [`bin/sync-special-files`](../../bin/sync-special-files)
