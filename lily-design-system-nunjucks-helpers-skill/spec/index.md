# Lily Design System™ — Nunjucks Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan `lily-design-system-skill` and
`lily-design-system-maintainer-skill` implement — this subproject and its
sibling `lily-design-system-nunjucks-headless-skill` extend that plan
with a framework-scoped pair.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume
[`lily-design-system-nunjucks-helpers`](../../lily-design-system-nunjucks-helpers/):
the six `*-picker` packages (`theme-picker`, `locale-picker`,
`text-size-picker`, `motion-picker`, `share-picker`, `date-time-picker`),
the macro-plus-`client.js` split this catalog uses because Nunjucks
renders server-side / at build time and cannot read `localStorage`,
mutate `document.head`, or attach event listeners, the shared
icon-button-opens-listbox markup contract for the four preference
helpers versus `share-picker`'s disclosure-of-links and
`date-time-picker`'s field-plus-dialog shape, and `motion-picker`'s one
documented deviation from the canonical (Svelte) contract. It is content
and documentation, not a component implementation — it ships no macros,
no client.js modules, no example app.

Its sibling, [`lily-design-system-nunjucks-headless-skill`](../../lily-design-system-nunjucks-headless-skill/),
covers the 491-component headless macro catalog instead — a different
package with no client.js at all. The framework-agnostic
[`lily-design-system-skill`](../../lily-design-system-skill/) covers Lily
concepts that apply across all seven frameworks and is this subproject's
first stop for anything not specific to the Nunjucks helpers.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the six helpers' one-line contracts, the
  macro-plus-client.js split, the shared markup contract for the four
  preference helpers, `share-picker`'s and `date-time-picker`'s
  divergent shapes, and the `motion-picker` server/client deviation.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/helpers.md`, `AGENTS/nunjucks.md`, or any individual
  helper's own `spec/index.md` in full — `SKILL.md` points at them so
  the root and subproject files stay the single source of truth.
- Any component implementation, example page, or headless macro.
- The 491-component headless macro catalog — that's
  `lily-design-system-nunjucks-headless-skill`'s job.
- Maintainer-facing tooling and workflow content for the monorepo as a
  whole — that's `lily-design-system-maintainer-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no
tests to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `SKILL.md` content is grounded in the real Nunjucks helpers
      catalog's `AGENTS.md` / `spec/index.md` / `index.md` and the
      `motion-picker` helper's own `spec/index.md` — no invented version
      numbers, test counts, or contract details.
- [x] The `motion-picker` server/client deviation is stated precisely:
      no `matchMedia` at template-render time, so the macro marks
      `motions[0]` selected server-side and `motion-picker.client.js`
      corrects it on init.
- [ ] The 14 special files present via `bin/sync-special-files`; not yet
      done as of 2026-09-04.
- [ ] `bin/test` passes with this subproject in place; not yet verified
      as of 2026-09-04.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [`lily-design-system-nunjucks-helpers`'s spec/index.md](../../lily-design-system-nunjucks-helpers/spec/index.md) —
  the catalog this skill teaches consumers to use; the source of truth
  for the six packages, their conventions, and the macro-plus-client.js
  split.
- [`lily-design-system-nunjucks-motion-picker`'s spec/index.md](../../lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-motion-picker/spec/index.md) —
  the one helper with a documented server/client deviation, cited
  precisely in `SKILL.md`.
- [`lily-design-system-nunjucks-headless-skill`'s spec/index.md](../../lily-design-system-nunjucks-headless-skill/spec/index.md) —
  the sibling skill covering the 491-component headless macro catalog
  instead of the picker helpers.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  two-skill (consumer / maintainer) plan this subproject's naming
  convention and full-subproject treatment follow.
