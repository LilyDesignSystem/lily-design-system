# Changelog — Lily Design System Vue Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.2.0**: migrated from
  the radio-group "picker" rendering to a native `<select>` with
  `<option>` children (landed in-tree 2026-06-17), with renamed packages
  (`*-picker` → `*-select`), changed class hooks, and native `<select>`
  keyboard semantics. Behaviour contracts (DOM application, persistence,
  SSR safety, i18n) are unchanged.

### Added

- `text-size-select` **0.1.0** — native-`<select>` text-size helper that
  sets `data-text-size` on the document root, with optional
  `localStorage` persistence (added 2026-06-17; born select-based, so it
  carries no picker migration).

## 0.1.0 — 2026-06-05

Initial release. Two helpers ported from the Svelte canonical
catalog:

### Added

- `lily-design-system-vue-theme-select` v0.1.0 — runtime-loading
  theme select with `data-theme` swap, `<link>`-based stylesheet
  injection, `localStorage` persistence, and a scoped slot for custom
  rendering. Fully mirrors the Svelte canonical contract; 13
  acceptance criteria covered.
- `lily-design-system-vue-locale-select` v0.1.0 — BCP 47 locale
  select that writes `lang` and `dir` on the document root, with
  optional `localStorage` persistence and `navigator.languages`
  detection. Built-in 436-row locale-name table and RTL detection.
  23 acceptance criteria covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories mirroring the Svelte canonical depth.

### Conventions established

- `<script setup lang="ts">` everywhere.
- `defineProps<Props>()` + `withDefaults` + `defineEmits<...>()`.
- Two-way binding via `v-model:value`.
- Default scoped slot as the Vue equivalent of Svelte snippets and
  React render-props.
- Zero CSS shipped — consumer styles the kebab-case class hook.
- SSR-safe: all DOM writes inside `onMounted` / `watch`.
- Tests use vitest + jsdom + `@vue/test-utils`.

### Differences from the Svelte canonical

| Concept                 | Svelte canonical                       | Vue port                                |
| ----------------------- | -------------------------------------- | --------------------------------------- |
| Two-way binding         | `bind:value`                           | `v-model:value`                         |
| Reactive state          | `$state`, `$bindable`                  | `ref`, `defineModel`/`v-model`          |
| Reactive side-effects   | `$effect`                              | `watch`, `onMounted`                    |
| Render props / slots    | Snippet (`{#snippet children(...)}`)   | Scoped default slot                     |
| Stylesheet head         | `<svelte:head>`                        | Vue's `<Teleport to="head">` or Nuxt's `useHead` |
| Cookie / SSR            | `hooks.server.ts` + `transformPageChunk` | Nuxt server middleware + `useHead`    |
| Storybook integration   | `*.stories.svelte`                     | `*.stories.ts` (Storybook Vue)          |
| File ext for components | `.svelte`                              | `.vue`                                  |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
