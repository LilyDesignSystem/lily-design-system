# Lily Design System™ — Vue Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan this subproject's siblings implement.

## 1. Role in the ecosystem

A Claude Skill that explains how to install, import, and consume
[`lily-design-system-vue-headless`](../../lily-design-system-vue-headless/)
— the Vue 3 implementation of Lily's headless component catalog — using
that library's own Composition API idiom: SFC `<script setup lang="ts">`,
`:class` base-plus-consumer binding, `v-bind="$attrs"` fallthrough,
`<slot />`, `defineModel()`. It is content and documentation, not a
component implementation — it ships no headless components, no example
app, no helper packages.

Its siblings:

- [`lily-design-system-skill`](../../lily-design-system-skill/) covers
  Lily's framework-agnostic concepts, terminology, naming conventions, and
  composition patterns — this subproject narrows that to one framework's
  consumption syntax rather than duplicating it.
- [`lily-design-system-vue-helpers-skill`](../../lily-design-system-vue-helpers-skill/)
  covers the parallel `*-picker` helpers catalog for Vue
  (`lily-design-system-vue-helpers`), a separate npm package family with
  its own contract.

## 2. Scope

### In scope

- `SKILL.md` — the skill: `lily-design-system-vue-headless`'s package
  identity and install command, the Vue 3 SFC consumption idiom (class
  binding, `v-bind="$attrs"`, slots, `defineModel()`, emitted events),
  and pointers to the framework-agnostic naming and composition
  references.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the Vue headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root files
  and that subproject's own docs stay the single source of truth.
- Any component implementation.
- The Vue helpers catalog's own contract (that's
  `lily-design-system-vue-helpers-skill`'s job) and any other framework's
  consumption idiom.

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

- [`../../lily-design-system-vue-headless/spec/index.md`](../../lily-design-system-vue-headless/spec/index.md) —
  the Vue headless library's own spec: the Composition API conventions,
  the component source template, and test/Storybook verification this
  skill's usage guidance is grounded in.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this subproject narrows to
  one framework.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  two-skill plan (`lily-design-system-skill` /
  `lily-design-system-maintainer-skill`) this subproject's naming
  convention follows.
