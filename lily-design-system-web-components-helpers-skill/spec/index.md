# Lily Design System™ — Web Components Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` and
`lily-design-system-maintainer-skill`) this subproject builds on top of.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume
[`lily-design-system-web-components-helpers`](../../lily-design-system-web-components-helpers/):
the catalog of six `<lily-*-picker>` web-component helpers — `theme-picker`,
`locale-picker`, `text-size-picker`, `motion-picker`, `share-picker`,
`date-time-picker` — that sit alongside the (456/491, its full achievable scope) Web
Components headless catalog. It is content and documentation, not a
component implementation — it ships no helper packages of its own.

**Provenance, stated precisely.** The catalog this skill documents is a
maintainer-directed (2026-09-03) **independent copy** of
[`lily-design-system-html-helpers`](../../lily-design-system-html-helpers/)
— itself already six vanilla custom elements — differing only in tag
prefix (`<lily-theme-picker>` rather than bare `<theme-picker>`) and
package naming. Nothing ports between the two catalogs automatically: a
change to one must be applied to the other deliberately, by hand. Neither
catalog is generated from, or a thin wrapper around, the other. The Svelte
catalog (`lily-design-system-svelte-helpers`) remains canonical for the
shared behavioural contract. This skill must state that relationship
exactly as above — never as an automatic fork/sync, and never as two
unrelated catalogs that happen to coincide.

This is the framework-specific counterpart, for the Web Components helpers
catalog, to the general [`lily-design-system-skill`](../../lily-design-system-skill/).
Its sibling, [`lily-design-system-web-components-headless-skill`](../../lily-design-system-web-components-headless-skill/),
covers the neighbouring (456/491, its full achievable scope) headless component library
instead of the helpers catalog.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the six helpers and what each owns (a
  preference, an action, or a form value), the `<lily-*-picker>` tag
  prefix and package naming, the three markup shapes (the shared
  icon-button-plus-listbox pattern for the four preference helpers,
  `share-picker`'s disclosure exception, `date-time-picker`'s
  field-plus-dialog exception), the attribute/property/event contract, the
  install-and-consume idiom, and the precise provenance statement relating
  this catalog to `lily-design-system-html-helpers`.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*` naming
  convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/helpers.md`, the Web Components helpers catalog's own
  `AGENTS.md`, or any individual helper's own `spec/index.md` in full —
  `SKILL.md` points at them so the underlying source stays the single
  source of truth.
- Any component implementation, example page, or helper package.
- **Overstating or understating the provenance relationship to
  `lily-design-system-html-helpers`.** This skill states plainly that the
  Web Components catalog is an independent copy with no automatic sync —
  never implying a live fork relationship, and never omitting that the two
  catalogs share a common origin and contract.
- The Web Components headless catalog's own conventions (the partial
  456/491 scope, the two architecture decisions) — that's
  `lily-design-system-web-components-headless-skill`'s job.
- The HTML helpers catalog's own conventions (bare `<theme-picker>` tags,
  a separately maintained subproject) — that's
  `lily-design-system-html-helpers-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] `SKILL.md` names all six helpers, their `<lily-*-picker>` tags, and
      what each owns (preference / action / form value).
- [x] `SKILL.md` states the provenance relationship to
      `lily-design-system-html-helpers` precisely: an independent copy,
      differing in tag prefix and package naming, with nothing porting
      automatically between the two.
- [x] `SKILL.md` documents the three markup shapes (preference listbox,
      share disclosure, date-time field+dialog) without restating each
      helper's full spec.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [ ] The special files are present via `bin/sync-special-files`.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [../../lily-design-system-web-components-helpers/spec/index.md](../../lily-design-system-web-components-helpers/spec/index.md) —
  the Web Components helpers catalog's own specification and its
  provenance note in full; the canonical source this skill points at
  rather than duplicates.
- [../../lily-design-system-html-helpers-skill/spec/index.md](../../lily-design-system-html-helpers-skill/spec/index.md) —
  the skill for the catalog this one was independently copied from; useful
  for contrasting the bare `<theme-picker>` tags against this catalog's
  `<lily-theme-picker>` tags.
- [../../lily-design-system-web-components-headless-skill/spec/index.md](../../lily-design-system-web-components-headless-skill/spec/index.md) —
  the sibling skill for the neighbouring (456/491, its full achievable scope) Web Components
  headless catalog these helpers sit alongside.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the general Lily concepts skill this subproject specialises for the Web
  Components helpers idiom.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the two-skill plan (`lily-design-system-skill` /
  `lily-design-system-maintainer-skill`) and naming convention this
  framework-specific skill extends.
