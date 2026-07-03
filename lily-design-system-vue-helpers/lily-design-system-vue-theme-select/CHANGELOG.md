# Changelog — ThemeSelect (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="theme-select">` with one `<option class="theme-select-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `theme-select` now names the `<select>` root
  and `theme-select-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

### Unchanged

- The behaviour contract: DOM application (`data-theme` + managed `<link>` swap), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

## Unreleased

### Changed

- **Root markup migrated to a native `<select>`.** The select now
  renders `<select class="theme-select" aria-label="…" name="…">`
  with one `<option class="theme-select-option">` per theme slug,
  replacing the previous grouped-control markup. This matches the
  Svelte canonical, removes the per-option label span, and inherits
  the platform combobox semantics (implicit `role="combobox"` on
  `<select>`, `role="option"` on each `<option>`, Arrow / Home / End
  / typeahead keyboard behaviour) for free. The selected-state ARIA
  and manual focus notes are gone; the accessible name still comes
  from `aria-label`. The default scoped slot now renders `<option>`
  elements; `SlotArgs` (`{ themes, value, setTheme, name, labelFor }`)
  is unchanged.

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `ThemeSelect.vue` — Vue 3 SFC with `<script setup lang="ts">`.
  Implements the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one
    `<option>` per theme slug.
  - Manages a single `<link rel="stylesheet" data-lily-theme-select="{name}">`
    in `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `v-model:value`.
  - `change` event for post-apply side effects.
  - Default scoped slot for custom rendering with
    `{ themes, value, setTheme, name, labelFor }`.
- `index.ts` barrel re-exporting `default`, `ThemeSelect`,
  `normaliseThemesUrl`, `themeHref`, and the `Props` + `SlotArgs`
  types.
- `ThemeSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `props-reference.md`,
  `recipes.md`, `ssr.md` (Nuxt notes), `styling.md`,
  `troubleshooting.md`.
- `examples/` subdirectory: `basic.vue`, `custom-labels.vue`,
  `custom-rendering.vue`, `lily-themes.vue`, `multiple-selects.vue`,
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
`lily-design-system-svelte-theme-select` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to the
  `change` Vue event. Use `@change="..."` in templates.
- The `children` snippet from Svelte maps to the default scoped
  slot in Vue. Slot args are camelCase in TypeScript, kebab-case in
  template attribute bindings.
