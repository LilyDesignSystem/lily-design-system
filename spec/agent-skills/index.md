# Agent skills

## Summary

Two repository top-level [Claude Skill](https://code.claude.com/docs/en/skills)
packages give AI coding agents a curated, loadable entry point into Lily
Design System: [`lily-design-system-skill`](../../lily-design-system-skill/)
for people building *with* the system, and
[`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/)
for people working *on* this monorepo. Both follow the same
`lily-design-system-` naming convention and get identical full-subproject
treatment (as of 2026-08-31 — see "Naming-split retirement" below for the
history).

## Scope

### In scope

- `lily-design-system-skill` — general-purpose: concepts, terminology,
  naming conventions, composition patterns, and framework choice, for end
  users and consumers of Lily Design System.
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

- **Two skills, two audiences, one naming convention.** `lily-design-system-skill`
  is portable in spirit — useful in any project that consumes Lily Design
  System, not just this monorepo — while `lily-design-system-maintainer-skill`
  is bound to this repository's own tooling and conventions and is not
  useful anywhere else. Both nonetheless share the `lily-design-system-`
  prefix (as of 2026-08-31; see "Naming-split retirement" below), because a
  directory's naming convention is a statement about repository plumbing
  (is it swept into `bin/list-implementations`/`bin/sync-special-files`?),
  not about the audience its content targets.
- **The naming prefix decides subproject treatment.** Every directory name
  starting with the `lily-design-system-` prefix is swept up by
  `bin/list-implementations` and `bin/sync-special-files` as an
  implementation subproject, held to the full required-files bar
  (`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`,
  `spec/index.md`, the 14 special files, `.git-subtree-push`), per
  [architecture](../architecture/index.md) and
  [special-files-for-public-repos](../special-files-for-public-repos/index.md).
  Both skills now carry the full set.
- **Content, not code.** Neither skill folder ships components, tests, or
  a build step — a skill package is documentation for an AI agent, so
  `bin/test`'s per-framework checks (Storybook, vitest, Playwright) don't
  apply to it.
- **`SKILL.md` is the entry point, `index.md` is the human overview.**
  `index.md` explains what the package is for a person browsing the repo;
  `SKILL.md` is what an agent actually loads. `README.md` symlinks to
  `index.md` in both skills.

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

Identical as of 2026-08-31:

| File | `lily-design-system-skill` | `lily-design-system-maintainer-skill` |
| --- | --- | --- |
| `SKILL.md` | yes | yes |
| `README.md` (symlink) | → `index.md` | → `index.md` |
| `index.md` | yes | yes |
| `AGENTS.md` / `CLAUDE.md` | yes | yes |
| `spec/index.md` | yes | yes |
| 14 special files + `.git-subtree-push` | yes, via `bin/sync-special-files` | yes, via `bin/sync-special-files` |
| `reference/*.md` | yes (naming-and-catalog, composition-patterns) | — |

### Naming-split retirement (2026-08-31)

`lily-skill` was renamed to `lily-design-system-skill`, retiring the
naming-prefix split this topic originally documented. Before the rename,
`lily-skill` deliberately sat outside the `lily-design-system-` prefix and
carried only `SKILL.md` + `README.md` (symlink to `SKILL.md`) +
`reference/` — excluded from `bin/list-implementations` and
`bin/sync-special-files`'s full-subproject treatment by name alone. The
rename brought it under the same prefix as every other implementation
subproject, which — given `bin/sync-special-files`'s `parts()` already
matched any `-skill`-suffixed name generically rather than hardcoding
`lily-design-system-maintainer-skill` by name (see "Tooling touched")
— required no tooling change at all: `lily-design-system-skill` was
automatically picked up, scaffolded with the full required-files set
(`index.md`, `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
`.git-subtree-push`, the 14 special files via `bin/sync-special-files`),
and its `README.md` symlink retargeted from `SKILL.md` to the new
`index.md`, matching the maintainer skill's own shape.

### Tooling touched

`bin/list-implementations`'s glob was tightened from `lily-*` to
`lily-design-system-*` when `lily-skill` was first added, so a future
top-level `lily-*` package that isn't an implementation subproject
wouldn't get swept into `bin/test`'s full-subproject checks by name
collision alone — a precaution that turned out to matter less once the
2026-08-31 rename removed the collision case entirely, but the tightened
glob remains correct regardless. `bin/sync-special-files` gained a
`"skill"` kind (matched by a `-skill` suffix, not by hardcoding either
skill's exact name) so its generated `INSTALL.md`/`CITATION.cff` describe
a skill package accurately instead of assuming an npm/dotnet-run
application — this generic match is exactly why the 2026-08-31 rename
needed no code change to bring `lily-design-system-skill` under the same
treatment.

## Acceptance criteria

- [x] Both skill folders exist at the repository root, both named under
      the `lily-design-system-` prefix as of 2026-08-31.
- [x] Each has a `SKILL.md` with `name` + `description` frontmatter
      naming concrete trigger phrases.
- [x] Both skills carry the full required-files set (`index.md`,
      `README.md` symlink to `index.md`, `AGENTS.md`, `CLAUDE.md`,
      `spec/index.md`, `.git-subtree-push`, the 14 special files via
      `bin/sync-special-files`) and pass `bin/test`.
- [x] `bin/sync-special-files`'s generated files for both skills describe
      a Claude Skill, not an application (verified: the other 20
      implementation subprojects' generated output is unchanged).
- [x] Each skill was committed separately at introduction.
- [x] This topic is linked from [spec/index.md](../index.md)'s topic
      table.
- [ ] A real `.git-subtree-push` remote is configured for either skill
      and the first push has happened — not done as of 2026-08-31 for
      either.

## Related topics

- [architecture](../architecture/index.md) — the monorepo layout and the
  required-files convention both skills now follow.
- [llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md) — the
  other AI-guidance file pair this same work session added.
- [special-files-for-public-repos](../special-files-for-public-repos/index.md) —
  the 14-file contract both skills carry.

## Sources

- [`lily-design-system-skill/SKILL.md`](../../lily-design-system-skill/SKILL.md)
- [`lily-design-system-maintainer-skill/SKILL.md`](../../lily-design-system-maintainer-skill/SKILL.md)
- [`bin/list-implementations`](../../bin/list-implementations)
- [`bin/sync-special-files`](../../bin/sync-special-files)
