# Changelog — ThemePicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `ThemePicker.vue` — Vue 3 SFC with `<script setup lang="ts">`.
  Implements the full Svelte canonical contract:
  - Renders `<fieldset role="radiogroup" aria-label="…">` with one
    `<input type="radio">` per theme slug.
  - Manages a single `<link rel="stylesheet" data-lily-theme-picker="{name}">`
    in `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `v-model:value`.
  - `change` event for post-apply side effects.
  - Default scoped slot for custom rendering with
    `{ themes, value, setTheme, name, labelFor }`.
- `index.ts` barrel re-exporting `default`, `ThemePicker`,
  `normaliseThemesUrl`, `themeHref`, and the `Props` + `SlotArgs`
  types.
- `ThemePicker.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec.md` §7 (13 items + extras).
- `spec.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `props-reference.md`,
  `recipes.md`, `ssr.md` (Nuxt notes), `styling.md`,
  `troubleshooting.md`.
- `examples/` subdirectory: `basic.vue`, `custom-labels.vue`,
  `custom-rendering.vue`, `lily-themes.vue`, `multiple-pickers.vue`,
  `persistence.vue`, `preloaded.vue`, `system-preference.vue`,
  `two-way-binding.vue`, plus `nuxt-cookie/` with `app.vue`,
  `plugins/theme.ts`, `server/middleware/theme.ts`,
  `server/api/theme.post.ts`.

### Conventions

- Vue 3 Composition API, `<script setup lang="ts">`.
- Zero runtime dependencies beyond `vue`.
- SSR-safe: all DOM writes inside `onMounted` / `watch`.
- Tested under vitest + jsdom + `@vue/test-utils`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-picker` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to the
  `change` Vue event. Use `@change="..."` in templates.
- The `children` snippet from Svelte maps to the default scoped
  slot in Vue. Slot args are camelCase in TypeScript, kebab-case in
  template attribute bindings.
