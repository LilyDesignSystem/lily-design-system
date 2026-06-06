# Changelog — LocalePicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `LocalePicker.vue` — Vue 3 SFC with `<script setup lang="ts">`.
  Implements the full Svelte canonical contract:
  - Renders `<fieldset role="radiogroup" aria-label="…">` with one
    `<input type="radio">` per locale code, wrapped in a
    `<label lang="{tagFor(locale)}">` per WCAG 3.1.2 (Language of
    Parts).
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
- `index.ts` barrel re-exporting `default`, `LocalePicker`,
  `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, and the `Props` +
  `SlotArgs` types.
- `LocalePicker.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec.md` §7 (23 items).
- `spec.md` — spec-driven contract, version 0.1.0.
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
`lily-design-system-svelte-locale-picker` v0.1.0. The DOM contract,
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
