# Lily Design System™ — Vue Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan this subproject's siblings implement.

## 1. Role in the ecosystem

A Claude Skill that explains how to install, import, and consume the six
packages in
[`lily-design-system-vue-helpers`](../../lily-design-system-vue-helpers/)
— `theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
`share-picker`, `date-time-picker` — using that catalog's own Vue 3
Composition API idiom: `v-model` via `defineModel()`, `v-bind="$attrs"`
fallthrough, prop-driven labels, SSR-safe `onMounted`/`watch` DOM writes.
It is content and documentation, not a component implementation — it
ships no headless components, no example app, no helper packages of its
own.

Its siblings:

- [`lily-design-system-skill`](../../lily-design-system-skill/) covers
  Lily's framework-agnostic concepts, terminology, and the shared helper
  contract every catalog follows — this subproject narrows that to one
  framework's consumption syntax rather than duplicating it.
- [`lily-design-system-vue-headless-skill`](../../lily-design-system-vue-headless-skill/)
  covers the parallel headless component catalog for Vue
  (`lily-design-system-vue-headless`), a separate npm package family with
  a separate contract.

## 2. Scope

### In scope

- `SKILL.md` — the skill: each of the six Vue `*-picker` packages'
  identity and install command, the per-helper one-line contract table,
  the three shared shapes (icon-button-plus-listbox, disclosure-of-links,
  field-plus-dialog), and the Vue 3 SFC consumption idiom
  (`defineModel()`/`v-model`, `v-bind="$attrs"`, prop-driven labels,
  SSR-safety, idempotent apply).
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/helpers.md` or the Vue helpers catalog's own
  `spec/index.md` in full — `SKILL.md` points at them so the root files
  and that catalog's own docs stay the single source of truth.
- Any component implementation.
- The Vue headless component catalog's own contract (that's
  `lily-design-system-vue-headless-skill`'s job) and any other framework's
  helpers consumption idiom.

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

- [`../../lily-design-system-vue-helpers/spec/index.md`](../../lily-design-system-vue-helpers/spec/index.md) —
  the Vue helpers catalog's own spec: per-helper contracts, file shape,
  and test verification this skill's usage guidance is grounded in.
- [`../../lily-design-system-vue-headless-skill/spec/index.md`](../../lily-design-system-vue-headless-skill/spec/index.md) —
  the sibling skill for the Vue headless component catalog.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this subproject narrows to
  one framework.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  two-skill plan (`lily-design-system-skill` /
  `lily-design-system-maintainer-skill`) this subproject's naming
  convention follows.
