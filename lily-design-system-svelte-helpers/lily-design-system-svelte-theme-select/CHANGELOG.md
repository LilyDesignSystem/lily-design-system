# Changelog — ThemeSelect (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release. This is the **canonical reference implementation**
for Lily's theme select; the Vue, React, Angular, Blazor, Nunjucks,
and HTML ports port from this contract clause-for-clause.

### Added

- `ThemeSelect.svelte` — Svelte 5 component using runes throughout
  (`$props`, `$bindable`, `$effect`). Implements:
  - Renders a native `<select aria-label="…" name="…">` with one
    `<option>` per theme slug.
  - Manages a single `<link rel="stylesheet" data-lily-theme-select="{name}">`
    in `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `bind:value` on a `$bindable("")` prop.
  - `onChange` callback for post-apply side effects.
  - `children` snippet for custom rendering with
    `{ themes, value, setTheme, name, labelFor }`.
- `index.ts` barrel re-exporting `default`, `ThemeSelect`,
  `normaliseThemesUrl`, `themeHref`, and the `Props` + `ChildArgs`
  types.
- `ThemeSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `ThemeSelect.stories.svelte` — Storybook story for the select.
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS.md` — fast-index pointer for AI agents.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `props-reference.md`,
  `recipes.md`, `ssr.md`, `styling.md`, `troubleshooting.md`.
- `examples/` subdirectory: `basic.svelte`, `custom-labels.svelte`,
  `custom-rendering.svelte`, `lily-themes.svelte`,
  `multiple-selects.svelte`, `persistence.svelte`,
  `preloaded.svelte`, `system-preference.svelte`,
  `two-way-binding.svelte`, plus a `sveltekit-cookie/` directory
  with `hooks.server.ts`, `app.html.snippet`, `+layout.server.ts`,
  `+layout.svelte`, `+page.svelte`, `api+server.ts`, `README.md`.

### Conventions

- **Svelte 5 runes** throughout. No legacy `export let`, no `$:`,
  no `createEventDispatcher`.
- **TypeScript** on the public surface. `Props` and `ChildArgs`
  exported from a `<script lang="ts" module>` block.
- **Zero runtime dependencies** beyond `svelte`.
- **SSR-safe** — all DOM writes inside `$effect`.
- **No `<style>` block** — consumer styles the `theme-select` class
  hook.
- **Tested** under vitest + jsdom + `@testing-library/svelte`.

### Notes

- The canonical reference catalog for the framework-helper layer.
  Vue, React, Angular, Blazor, Nunjucks, and HTML ports adopt this
  contract; differences are documented in each port's CHANGELOG.
- The `onChange` callback prop maps to a Vue event, a React
  `onChange` prop, an Angular `(change)` output, etc.
- The `children` snippet maps to a Vue default scoped slot, a React
  `children` render prop, an Angular `*ngTemplateOutlet`-based
  pattern, etc.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
