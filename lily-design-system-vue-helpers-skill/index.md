# Lily Design System™ — Vue Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to install,
import, and consume the six packages in
[`lily-design-system-vue-helpers`](../lily-design-system-vue-helpers/) —
`theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
`share-picker`, `date-time-picker` — using correct Vue 3 Composition API
idiom: `v-model` via `defineModel()`, `v-bind="$attrs"`, prop-driven
labels.

It is one of two Vue-specific skill subprojects, alongside
[`lily-design-system-vue-headless-skill`](../lily-design-system-vue-headless-skill/)
(the headless component catalog). Both are narrower, framework-specific
siblings of [`lily-design-system-skill`](../lily-design-system-skill/),
which covers Lily's concepts, terminology, and composition patterns
without committing to any one framework's syntax.

## What it's for

Load this skill when someone asks how to install or import one of the Vue
`*-picker` packages, wants a Vue 3-correct usage example of a helper,
needs an individual package's npm name, or is unsure which of the three
shapes a given helper follows (icon-button-plus-listbox, disclosure of
links, or field-plus-dialog). It doesn't restate `AGENTS/helpers.md` or
the Vue helpers catalog's own `spec/index.md` in full — it points at
them, so the underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: package identities, install
  commands, the per-helper one-line contracts, the three shared shapes,
  and the Vue 3 consumption idiom.

Scaffolded to match the other implementation subprojects — including the
special files and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
