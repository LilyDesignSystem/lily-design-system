# Changelog — LocaleSelect (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="locale-select">` with one `<option class="locale-select-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `locale-select` now names the `<select>` root
  and `locale-select-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

### Unchanged

- The behaviour contract: DOM application (`lang` / `dir`), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

## 0.2.0 — 2026-06-15

### Changed

- **Root markup migrated to a native `<select>`.** The root element
  is now `<select class="locale-select" aria-label="…" name="…">`
  with one `<option class="locale-select-option" value="…" lang="…">`
  per locale code, replacing the previous grouped-control markup.
  The `<select>` carries the implicit `combobox` role and provides
  Arrow / Home / End / typeahead semantics natively, so the select
  scales to long locale lists and pops the OS-native picker on
  mobile. Each `<option>` keeps its `lang` attribute for WCAG 3.1.2
  (Language of Parts) pronunciation. The previous per-option label
  span is removed; the label text now sits directly inside the
  `<option>`, and the implicit selected-option state replaces the old
  grouped-control selection state. The default scoped slot's
  `SlotArgs` are unchanged.

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `LocaleSelect.vue` — Vue 3 SFC with `<script setup lang="ts">`.
  Implements the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one
    `<option lang="{tagFor(locale)}">` per locale code per WCAG 3.1.2
    (Language of Parts).
  - Sets `lang="{bcp47LocaleTag(code)}"` on the resolved target
    element (defaults to `document.documentElement`).
  - Sets `dir="rtl"` / `dir="ltr"` on the target element via
    `isRtlLocale()` auto-detection. Opt-out via `:apply-dir="false"`.
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `v-model:value`.
  - `change` event for post-apply side effects.
  - Default scoped slot for custom rendering with
    `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.
- `locales.ts` — 436-row built-in locale-code → English-name table
  plus RTL language and script subtag sets. Byte-identical to the
  Svelte canonical helper (framework-agnostic data).
- `locales.tsv` — canonical source for `locales.ts`. Byte-identical
  to the Svelte canonical helper.
- `index.ts` barrel re-exporting `default`, `LocaleSelect`,
  `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, and the `Props` +
  `SlotArgs` types.
- `LocaleSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (23 items).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01-radios.vue`, `02-select.vue`,
  `03-buttons.vue`, `04-rtl-demo.vue`, `05-nhs-style.vue`,
  `06-with-vue-i18n.vue`, `07-with-paraglide.vue`,
  `08-ssr-cookie.vue`, `09-scoped-target.vue`, `10-combobox.vue`,
  plus a `README.md` index.

### Conventions

- Vue 3 Composition API, `<script setup lang="ts">`.
- Zero runtime dependencies beyond `vue`.
- SSR-safe: all DOM writes inside `onMounted` / `watch`.
- Tested under vitest + jsdom + `@vue/test-utils`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-select` v0.1.0. The DOM contract,
BCP 47 normalisation rules, RTL detection sets, initial-value
resolution order, and apply order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `change` Vue event. Use `@change="..."` in templates.
- The `children` snippet from Svelte maps to the default scoped
  slot in Vue. Slot args are camelCase in TypeScript, kebab-case in
  template attribute bindings (e.g. `set-locale`, `label-for`,
  `tag-for`, `is-rtl`).
- The bindable model name is `value`, not the Vue 3 default
  `modelValue`. Use `v-model:value="locale"` and not
  `v-model="locale"`.
- `target` accepts an `HTMLElement` or `null`; templates pass a
  `ref` directly (`:target="panelRef"`) since `useTemplateRef` /
  `ref()` round-trip the DOM node automatically once mounted.
