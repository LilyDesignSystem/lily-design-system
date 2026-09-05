# Lily Design System™ — HTML Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` and
`lily-design-system-maintainer-skill`) this subproject builds on top of.

## 1. Role in the ecosystem

A Claude Skill that explains
[`lily-design-system-html-helpers`](../../lily-design-system-html-helpers/):
the catalog of six web-component `*-picker` helpers — `theme-picker`,
`locale-picker`, `text-size-picker`, `motion-picker`, `share-picker`,
`date-time-picker` — that sit alongside the HTML headless library, each
owning one complete interaction end to end (a user preference for four of
them, an action for `share-picker`, a form value for `date-time-picker`).
It is content and documentation, not a component implementation — it ships
no headless components, no example app, no helper packages of its own.

This is the framework-specific counterpart, for the HTML helpers catalog, to
the general [`lily-design-system-skill`](../../lily-design-system-skill/).
Its own sibling, [`lily-design-system-html-headless-skill`](../../lily-design-system-html-headless-skill/),
covers the neighbouring headless component library
(`lily-design-system-html-headless`) instead of this helpers catalog.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the six helpers and what each owns, the three
  markup shapes (the shared preference-listbox contract, `share-picker`'s
  disclosure, `date-time-picker`'s field-plus-dialog), the
  attribute/property/`CustomEvent` surface, the install-and-consume idiom,
  and this catalog's relationship to the independent Web Components
  helpers copy — pointing at `AGENTS/helpers.md` and each helper's own
  `spec/index.md` rather than restating their contracts.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*` naming
  convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md`, `AGENTS/helpers.md`, or any individual helper's
  own `spec/index.md` in full — `SKILL.md` points at them so the root and
  subproject files stay the single source of truth.
- Any component implementation, example page, or helper package.
- The headless component catalog's own conventions — that's
  `lily-design-system-html-headless-skill`'s job.
- The independent Web Components helpers copy's own naming/provenance
  detail beyond a pointer — that catalog has its own skill.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [ ] The special files are present via `bin/sync-special-files`.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [../../lily-design-system-html-helpers/spec/index.md](../../lily-design-system-html-helpers/spec/index.md) —
  the HTML helpers catalog's own specification; the canonical source this
  skill points at rather than duplicates.
- [../../lily-design-system-html-headless-skill/spec/index.md](../../lily-design-system-html-headless-skill/spec/index.md) —
  the sibling skill for the headless component library these helpers sit
  alongside.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the general Lily concepts skill this subproject specialises for the HTML
  helpers idiom.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the two-skill plan (`lily-design-system-skill` /
  `lily-design-system-maintainer-skill`) and naming convention this
  framework-specific skill extends.
