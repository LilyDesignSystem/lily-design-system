# Lily Design System™ — Vue Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
eighteen-skill plan this subproject implements one part of.

## 1. Role in the ecosystem

An **umbrella** Claude Skill for Vue: it ties together the three real Vue
subprojects in this monorepo —
[`lily-design-system-vue-headless`](../../lily-design-system-vue-headless/)
(the 491-component catalog as unstyled `.vue` SFCs),
[`lily-design-system-vue-helpers`](../../lily-design-system-vue-helpers/)
(the six `*-picker` packages), and
[`lily-design-system-vue-nuxt-examples`](../../lily-design-system-vue-nuxt-examples/)
(the fully styled Nuxt 3 reference app) — helps an agent decide which one
a task needs, and gives standalone coverage of the example app, since
neither of its two more specific sibling skills covers it. It sits one
level above those siblings in the skill hierarchy: general concepts skill
→ this umbrella → the two subproject-scoped skills.

Its siblings:

- [`lily-design-system-skill`](../../lily-design-system-skill/) covers
  Lily's framework-agnostic concepts, terminology, naming conventions, and
  composition patterns — this subproject narrows that to "which Vue
  subproject do I need" rather than duplicating it.
- [`lily-design-system-vue-headless-skill`](../../lily-design-system-vue-headless-skill/)
  covers `lily-design-system-vue-headless`'s own install/import/consumption
  idiom in depth.
- [`lily-design-system-vue-helpers-skill`](../../lily-design-system-vue-helpers-skill/)
  covers `lily-design-system-vue-helpers`'s own per-package contracts and
  consumption idiom in depth.

## 2. Scope

### In scope

- `SKILL.md` — the skill: a short map of the three real Vue subprojects
  and when to reach for each, pointers into the two sibling skills for
  their deep contracts, real coverage of
  `lily-design-system-vue-nuxt-examples` (required routes, NHS UK visual
  reference, how to run it, Nuxt-specific conventions and the one
  documented locale-picker persistence fix), the Vue-wide conventions that
  span all three subprojects (Composition API only,
  `<script setup lang="ts">`, Vitest), and a pointer to
  `lily-design-system-skill` for framework-agnostic concepts.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `lily-design-system-vue-headless-skill`'s or
  `lily-design-system-vue-helpers-skill`'s own content in full — this
  subproject points at them so their own `SKILL.md` files stay the single
  source of truth for their respective subprojects.
- Restating `AGENTS/*.md` in full — the same `@AGENTS/*.md` import block
  every subproject loads is grounding, not content to duplicate in prose.
- Any component, helper, or example-app implementation — this subproject
  ships no `.vue` files, no build, no tests beyond `bin/test`'s
  required-files checks.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] `SKILL.md` maps all three real Vue subprojects and states when to
      reach for each, without restating either sibling skill's content.
- [x] `SKILL.md` gives real, grounded coverage of
      `lily-design-system-vue-nuxt-examples` (routes, NHS UK reference,
      run instructions, Nuxt specifics) since no sibling skill covers it.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [ ] The special files are present via `bin/sync-special-files`.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-05.

## 5. Related topics

- [`../../lily-design-system-vue-headless-skill/spec/index.md`](../../lily-design-system-vue-headless-skill/spec/index.md) —
  the sibling skill for the Vue headless component catalog's own
  consumption idiom.
- [`../../lily-design-system-vue-helpers-skill/spec/index.md`](../../lily-design-system-vue-helpers-skill/spec/index.md) —
  the sibling skill for the Vue helpers catalog's own per-package
  contracts.
- [`../../lily-design-system-vue-nuxt-examples/spec/index.md`](../../lily-design-system-vue-nuxt-examples/spec/index.md) —
  the example app's own spec, the source this subproject's `SKILL.md`
  grounds its example-app coverage in.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this subproject narrows to
  "which Vue subproject."
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  eighteen-skill plan (the two general skills plus sixteen framework-
  specific ones, this subproject among them) and the naming-convention
  history behind it.
