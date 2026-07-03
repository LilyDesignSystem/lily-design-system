# Changelog — ThemeSelect (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `theme-select.njk` — Nunjucks 3 macro emitting a native
  `<select class="theme-select">` with one
  `<option class="theme-select-option">` per theme slug. Single
  `opts` parameter; required keys are `label`, `themesUrl`, `themes`.
  Renders deterministic markup with `data-lily-theme-select-*`
  configuration attributes for the client.js to read.
- `theme-select.client.js` — vanilla ES module owning the runtime
  lifecycle:
  - `initThemeSelect(root, opts)` — wires one `<select>`; returns a
    `{setTheme, destroy}` controller.
  - `autoInit(opts)` — finds every
    `[data-lily-theme-select-root]` on the page and wires it.
  - `normaliseThemesUrl(url)` and
    `themeHref(url, slug, extension)` — pure URL helpers.
  - Manages a single
    `<link rel="stylesheet" data-lily-theme-select="{name}">` in
    `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - `onChange(slug)` callback for post-apply side effects.
- `theme-select.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides:
  - `accessibility.md`
  - `custom-rendering.md`
  - `preloading.md`
  - `macro-opts-reference.md`
  - `recipes.md`
  - `ssr.md` (Eleventy / Express / Workers notes)
  - `styling.md`
  - `troubleshooting.md`
- `examples/` subdirectory:
  - `01-basic.njk`
  - `02-custom-labels.njk`
  - `03-multiple-selects.njk`
  - `04-persistence.njk`
  - `05-preloaded.njk`
  - `06-system-preference.njk`
  - `07-two-way-binding.njk`
  - `08-lily-themes.njk`
  - `09-custom-rendering.njk` (with companion
    `themeSelectCustom.njk`)
  - `eleventy-cookie/` end-to-end recipe with
    `_includes/base.njk`, `_data/site.js`, `index.njk`,
    `functions/_middleware.js`, `functions/api/theme.js`.

### Conventions

- Nunjucks 3 macro syntax with a single `opts` parameter object.
- camelCase macro name (`themeSelect`); kebab-case file path
  (`theme-select.njk`) and CSS class (`theme-select`).
- Companion ES-module runtime, framework-agnostic.
- Zero runtime dependencies beyond `nunjucks` server-side and DOM
  APIs client-side.
- SSR-safe: the macro is pure; the client.js guards every DOM
  access behind `typeof document !== "undefined"`.
- Tested under vitest + jsdom; macro rendered via
  `nunjucks.renderString`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select` v0.1.0 and the Vue port
`lily-design-system-vue-theme-select` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `onChange` field on the client.js init opts.
- The `children` snippet from Svelte (and the default scoped slot
  from Vue) maps to the Nunjucks `{% call %}` caller block. The
  shipped macro does not currently inspect `caller`; see
  [`docs/custom-rendering.md`](./docs/custom-rendering.md) for the
  fork pattern.
