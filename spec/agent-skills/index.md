# Agent skills

## Summary

Eighteen repository top-level [Claude Skill](https://code.claude.com/docs/en/skills)
packages give AI coding agents a curated, loadable entry point into Lily
Design System: [`lily-design-system-skill`](../../lily-design-system-skill/)
for people building *with* the system in general,
[`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/)
for people working *on* this monorepo, and — as of 2026-09-04 — sixteen
framework-specific skills, one headless-skill and one helpers-skill per
framework (angular, blazor, html, nunjucks, react, svelte, vue,
web-components). All eighteen follow the same `lily-design-system-`
naming convention and get identical full-subproject treatment (as of
2026-08-31 for the first two — see "Naming-split retirement" below for
that history — and 2026-09-04 for the sixteen framework-specific ones,
see "Framework-specific skills reversal" below).

## Scope

### In scope

- `lily-design-system-skill` — general-purpose: concepts, terminology,
  naming conventions, composition patterns, and framework choice, for end
  users and consumers of Lily Design System.
- `lily-design-system-maintainer-skill` — technical: the required-files
  layout, the `bin/` tooling, the spec-driven workflow, and pointers into
  the binding `AGENTS/*.md` design-principle rules, for people maintaining
  this monorepo.
- Sixteen framework-specific skills, `lily-design-system-{framework}-headless-skill`
  and `lily-design-system-{framework}-helpers-skill` for each of the eight
  framework families (angular, blazor, html, nunjucks, react, svelte, vue,
  web-components) — see "The sixteen framework-specific skills" below.
- Each skill's own `SKILL.md` (the Claude Skill entry point: YAML
  frontmatter with `name`/`description`/`license`, then Markdown
  instructions) and any `reference/*.md` files it loads on demand.

### Explicitly out of scope

- Restating the `AGENTS/*.md` design-principle rules, the `spec/` topic
  docs, or a framework's own subproject `AGENTS.md`/`spec/index.md` in
  full — every skill points at the canonical files rather than
  duplicating them, so those files stay the single source of truth.
- A skill scoped to a single component, a single helper package, or a
  single example app — the framework-headless/framework-helpers split is
  the finest grain this topic supports; a narrower need is served by
  reading that component's or package's own `AGENTS.md` directly, not by
  another skill package.
- Component implementation, example pages, or new headless/helper
  packages — a skill is documentation for an AI agent, never code that
  ships to a consumer.

## Principles and rules

- **Eighteen skills, one naming convention.** `lily-design-system-skill`
  is portable in spirit — useful in any project that consumes Lily Design
  System, not just this monorepo — while the other seventeen are bound to
  this repository's own subprojects and conventions. All eighteen
  nonetheless share the `lily-design-system-` prefix (as of 2026-08-31 for
  the first two, 2026-09-04 for the rest; see "Naming-split retirement"
  and "Framework-specific skills reversal" below), because a directory's
  naming convention is a statement about repository plumbing (is it swept
  into `bin/list-implementations`/`bin/sync-special-files`?), not about
  the audience its content targets.
- **The naming prefix decides subproject treatment.** Every directory name
  starting with the `lily-design-system-` prefix is swept up by
  `bin/list-implementations` and `bin/sync-special-files` as an
  implementation subproject, held to the full required-files bar
  (`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`,
  `spec/index.md`, the 14 special files, `.git-subtree-push`), per
  [architecture](../architecture/index.md) and
  [special-files-for-public-repos](../special-files-for-public-repos/index.md).
  All eighteen skills carry the full set.
- **Content, not code.** No skill folder ships components, tests, or a
  build step — a skill package is documentation for an AI agent, so
  `bin/test`'s per-framework checks (Storybook, vitest, Playwright) don't
  apply to any of them.
- **`SKILL.md` is the entry point, `index.md` is the human overview.**
  `index.md` explains what the package is for a person browsing the repo;
  `SKILL.md` is what an agent actually loads. `README.md` symlinks to
  `index.md` in every skill.
- **A framework-specific skill points at its own subproject's docs, not
  at a duplicate of them.** Each of the sixteen grounds its content by
  reading the real subproject it covers (`AGENTS.md`, `spec/index.md`)
  and states only what that reading verified — install status, exact
  package names, framework-specific idioms, and any documented deviation
  from the canonical contract (e.g. Nunjucks' server-rendered
  `motion-picker` default, the Angular wrapper-host tag+attribute-selector
  fix, the Web Components catalog's deliberate 33/491 partial scope).

## Detail sections

### Original directive

The first two skills were commissioned with this brief (kept verbatim as
the record of intent):

> Create repository top-level agent skills folders:
>
> - `lily-skill` -> general-purpose skill for end users, about concepts,
>   ideas, terminology, examples from this repo.
> - `lily-design-system-maintainer-skill` -> technical implementation
>   skill for maintainers working on this repository
>
> Commit each skill separately.

### File shape by skill

Identical across all eighteen skills as of 2026-09-04:

| File | General/maintainer skills | Framework-specific skills |
| --- | --- | --- |
| `SKILL.md` | yes | yes |
| `README.md` (symlink) | → `index.md` | → `index.md` |
| `index.md` | yes | yes |
| `AGENTS.md` / `CLAUDE.md` | yes | yes |
| `spec/index.md` | yes | yes |
| 14 special files + `.git-subtree-push` | yes, via `bin/sync-special-files` | yes, via `bin/sync-special-files` |
| `reference/*.md` | yes for `lily-design-system-skill` (naming-and-catalog, composition-patterns); none for the maintainer skill | none — each points into its own real subproject's docs instead |

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

### Framework-specific skills reversal (2026-09-04)

This topic originally listed "a third, framework-specific skill" as
explicitly out of scope, on the reasoning that a framework question
should be answered by pointing into that framework's own subproject docs
rather than by adding a new skill package. That decision is reversed as
of 2026-09-04, maintainer-directed: sixteen framework-specific skills
were added, one `{framework}-headless-skill` and one
`{framework}-helpers-skill` per framework family. The original reasoning
undersold the value of a skill an agent can load *before* it knows which
subproject to read — the general skill and the maintainer skill both
stop at "here are seven frameworks," and an agent asked "how do I use
Lily's React components" still had to discover, unprompted, that the
answer lives in `lily-design-system-react-headless/AGENTS.md`. A
dedicated skill closes that gap without duplicating the subproject's own
docs — see "A framework-specific skill points at its own subproject's
docs" above.

### The sixteen framework-specific skills

One `headless-skill` and one `helpers-skill` per framework family, each
covering exactly the one real subproject it is named after:

| Framework | Headless skill | Helpers skill |
| --- | --- | --- |
| Angular | [`lily-design-system-angular-headless-skill`](../../lily-design-system-angular-headless-skill/) → [`lily-design-system-angular-headless`](../../lily-design-system-angular-headless/) | [`lily-design-system-angular-helpers-skill`](../../lily-design-system-angular-helpers-skill/) → [`lily-design-system-angular-helpers`](../../lily-design-system-angular-helpers/) |
| Blazor | [`lily-design-system-blazor-headless-skill`](../../lily-design-system-blazor-headless-skill/) → [`lily-design-system-blazor-headless`](../../lily-design-system-blazor-headless/) | [`lily-design-system-blazor-helpers-skill`](../../lily-design-system-blazor-helpers-skill/) → [`lily-design-system-blazor-helpers`](../../lily-design-system-blazor-helpers/) |
| HTML | [`lily-design-system-html-headless-skill`](../../lily-design-system-html-headless-skill/) → [`lily-design-system-html-headless`](../../lily-design-system-html-headless/) | [`lily-design-system-html-helpers-skill`](../../lily-design-system-html-helpers-skill/) → [`lily-design-system-html-helpers`](../../lily-design-system-html-helpers/) |
| Nunjucks | [`lily-design-system-nunjucks-headless-skill`](../../lily-design-system-nunjucks-headless-skill/) → [`lily-design-system-nunjucks-headless`](../../lily-design-system-nunjucks-headless/) | [`lily-design-system-nunjucks-helpers-skill`](../../lily-design-system-nunjucks-helpers-skill/) → [`lily-design-system-nunjucks-helpers`](../../lily-design-system-nunjucks-helpers/) |
| React | [`lily-design-system-react-headless-skill`](../../lily-design-system-react-headless-skill/) → [`lily-design-system-react-headless`](../../lily-design-system-react-headless/) | [`lily-design-system-react-helpers-skill`](../../lily-design-system-react-helpers-skill/) → [`lily-design-system-react-helpers`](../../lily-design-system-react-helpers/) |
| Svelte | [`lily-design-system-svelte-headless-skill`](../../lily-design-system-svelte-headless-skill/) → [`lily-design-system-svelte-headless`](../../lily-design-system-svelte-headless/) | [`lily-design-system-svelte-helpers-skill`](../../lily-design-system-svelte-helpers-skill/) → [`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/) |
| Vue | [`lily-design-system-vue-headless-skill`](../../lily-design-system-vue-headless-skill/) → [`lily-design-system-vue-headless`](../../lily-design-system-vue-headless/) | [`lily-design-system-vue-helpers-skill`](../../lily-design-system-vue-helpers-skill/) → [`lily-design-system-vue-helpers`](../../lily-design-system-vue-helpers/) |
| Web Components | [`lily-design-system-web-components-headless-skill`](../../lily-design-system-web-components-headless-skill/) → [`lily-design-system-web-components-headless`](../../lily-design-system-web-components-headless/) (the partial, 33/491 catalog) | [`lily-design-system-web-components-helpers-skill`](../../lily-design-system-web-components-helpers-skill/) → [`lily-design-system-web-components-helpers`](../../lily-design-system-web-components-helpers/) (an independent copy of the HTML helpers, `<lily-*>` tag prefix) |

### Tooling touched

`bin/list-implementations`'s glob was tightened from `lily-*` to
`lily-design-system-*` when `lily-skill` was first added, so a future
top-level `lily-*` package that isn't an implementation subproject
wouldn't get swept into `bin/test`'s full-subproject checks by name
collision alone. `bin/sync-special-files` gained a `"skill"` kind
(matched by a `-skill` suffix, not by hardcoding any one skill's exact
name) so its generated `INSTALL.md`/`CITATION.cff` describe a skill
package accurately instead of assuming an npm/dotnet-run application.

Adding the sixteen framework-specific skills on 2026-09-04 found and
fixed a real, latent classification bug in that generic matching: its
`parts()` function checked the seven-framework prefix loop *before* the
`-skill` suffix, so a name like `lily-design-system-angular-headless-skill`
matched the `angular` prefix, and its tail (`headless-skill`) matched
neither `"headless"` nor `"helpers"` exactly — falling through to the
`"examples"` default and generating a wrong `INSTALL.md`
("Run this example application", `npm run dev`) and a generic
`CITATION.cff` for every framework-specific skill. Fixed by checking the
`-skill` suffix first. Fixing it also surfaced two adjacent, genuinely
pre-existing bugs in the same function, fixed at the same time: (1)
`"web-components"` was never in the `FRAMEWORK` label map at all, so
`lily-design-system-web-components-headless` and
`-web-components-helpers` (both already-existing real subprojects, not
skills) fell through to the same `"other"`/`"examples"` misclassification
— `lily-design-system-web-components-headless/INSTALL.md` was telling
readers to `npm install && npm run dev` a headless library; (2) the
generated helpers `INSTALL.md` text said "five helper packages" and
listed five rows, omitting `motion-picker` (added 2026-09-03, landed in
all eight catalogs) — corrected to six everywhere, including the Blazor
NuGet package table. `bin/list-implementations`'s own comment was also
updated: it previously claimed to match "exactly the 21
headless/examples/helpers subprojects," which was already stale once the
first two skills landed and is far more so now.

## Acceptance criteria

- [x] All eighteen skill folders exist at the repository root, all named
      under the `lily-design-system-` prefix.
- [x] Each has a `SKILL.md` with `name` + `description` frontmatter
      naming concrete trigger phrases.
- [x] All eighteen skills carry the full required-files set (`index.md`,
      `README.md` symlink to `index.md`, `AGENTS.md`, `CLAUDE.md`,
      `spec/index.md`, `.git-subtree-push`, the 14 special files via
      `bin/sync-special-files`) and pass `bin/test`.
- [x] `bin/sync-special-files`'s generated files for all eighteen skills
      (and for the two pre-existing `web-components-*` subprojects
      caught by the same classification fix) describe a Claude Skill or
      the correct real-subproject kind, not a misclassified application.
- [x] Each of the first two skills was committed separately at
      introduction; the sixteen framework-specific skills landed together
      as one dated change.
- [x] This topic is linked from [spec/index.md](../index.md)'s topic
      table.
- [ ] A real `.git-subtree-push` remote is configured for any of the
      eighteen skills and the first push has happened — not done as of
      2026-09-04 for any of them.

## Related topics

- [architecture](../architecture/index.md) — the monorepo layout and the
  required-files convention every skill now follows.
- [llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md) — the
  other AI-guidance file pair from the same original work session.
- [special-files-for-public-repos](../special-files-for-public-repos/index.md) —
  the 14-file contract every skill carries.
- [helpers](../helpers/index.md) — the six `*-picker` contracts every
  helpers-skill points into.

## Sources

- [`lily-design-system-skill/SKILL.md`](../../lily-design-system-skill/SKILL.md)
- [`lily-design-system-maintainer-skill/SKILL.md`](../../lily-design-system-maintainer-skill/SKILL.md)
- The sixteen `lily-design-system-{framework}-{headless,helpers}-skill/SKILL.md`
  files listed in "The sixteen framework-specific skills" above.
- [`bin/list-implementations`](../../bin/list-implementations)
- [`bin/sync-special-files`](../../bin/sync-special-files)
