# Lily Design System™ — Vue Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to install, import,
and consume [`lily-design-system-vue-headless`](../lily-design-system-vue-headless/)
— the Vue 3 implementation of Lily's headless component catalog — using
correct Vue 3 Composition API idiom: SFC `<script setup lang="ts">`,
`:class` binding, `v-bind="$attrs"`, `<slot />`, `defineModel()`.

It is one of two Vue-specific skill subprojects, alongside
[`lily-design-system-vue-helpers-skill`](../lily-design-system-vue-helpers-skill/)
(the `*-picker` helper catalog). Both are narrower, framework-specific
siblings of [`lily-design-system-skill`](../lily-design-system-skill/), which
covers Lily's concepts, terminology, and composition patterns without
committing to any one framework's syntax.

## What it's for

Load this skill when someone asks how to install or import
`lily-design-system-vue-headless`, wants a Vue 3 SFC-correct usage example
of a Lily headless component, or is unsure how class binding, fallthrough
attributes, or slots work in this library specifically. It doesn't restate
`AGENTS/headless.md`, `AGENTS/components.md`, or the Vue headless
subproject's own `spec/index.md` in full — it points at them, so the
underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: package identity, install
  command, the Vue 3 consumption idiom, theming, pointers to the naming
  and composition references.

Scaffolded to match the other implementation subprojects — including the
special files and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
