# Changelog — Lily Design System Nunjucks Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.3.0**: both are now
  *placeholder-pinned*. The closed `<select>` always displays a short
  placeholder word ("Theme", "Locale") instead of the active value, so
  the control is only ever as wide as that word rather than as wide as
  the longest option. Each renders a leading placeholder `<option>` with
  an empty value, carrying a new optional `placeholder` macro opt
  (defaults to the existing `label`, so no user-facing string is
  hardcoded), and pins the element's own selection to it — snapping back
  after every change.
- DOM contract: option count is `choices.length + 1`, the first option's
  value is `""`, and the element's own `value` no longer tracks the
  selection. Behaviour contracts (DOM application, persistence, SSR
  safety, i18n) are otherwise unchanged.
- `text-size-select` is untouched and stays at **0.1.0**.

### Added

- The compensating status region is now the default pattern in the
  examples and quick-starts: a visible `aria-live="polite"` element
  reporting the active value, wired through `autoInit({ onChange })`.
  It exists because placeholder-pinning means the control no longer
  announces its value to a screen reader; each package's
  `docs/accessibility.md` documents that tradeoff honestly rather than
  treating it as solved.

### Fixed

- Pre-hydration flash when `opts.value` was set. The initial value now
  travels as a `data-lily-{theme,locale}-select-value` attribute on the
  root instead of a server-rendered `selected` on the matching real
  option, so the placeholder is the only `selected` option in the server
  HTML and nothing flashes before hydration. Resolution order unchanged.

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
catalog, each split into a Nunjucks macro and a companion
client-side ES module.

### Added

- `lily-design-system-nunjucks-theme-select` v0.1.0 — runtime-loading
  theme select. The `themeSelect(opts)` macro emits a native
  `<select class="theme-select">` with `data-lily-theme-select-*`
  hooks; the companion `theme-select.client.js` injects a managed
  `<link rel="stylesheet">` in `<head>`, sets `data-theme="{slug}"`
  on the document root, optionally persists to `localStorage`, and
  mirrors the active slug onto the `<select>` value. 13 acceptance
  criteria covered.
- `lily-design-system-nunjucks-locale-select` v0.1.0 — BCP 47 locale
  select. The `localeSelect(opts)` macro emits a native
  `<select class="locale-select">` whose `<option>`s carry per-option
  `lang="{tag}"` attributes; the client.js writes `lang` and
  `dir` on the document root, with optional `localStorage`
  persistence and `navigator.languages` detection. Built-in 436-row
  locale-name table and RTL detection. 23 acceptance criteria
  covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories mirroring the Svelte canonical depth.

### Conventions established

- Nunjucks 3 macro syntax with a single `opts` parameter object.
- camelCase macro names (Nunjucks identifier rules); kebab-case
  file paths and CSS class hooks.
- Companion `*.client.js` ES module per macro, framework-agnostic.
- `data-lily-{name}-*` attribute contract between macro and
  client.js — no inline `<script>` tags in the macro output.
- SSR-safe: the macro is pure; the client.js guards every DOM
  access behind `typeof document !== "undefined"`.
- Zero CSS shipped — consumer styles the kebab-case class hook.
- Tests use vitest + jsdom; the macro is rendered via
  `nunjucks.renderString` and the client.js is exercised against
  the resulting jsdom document.

### Differences from sibling catalogs

| Concept                 | Svelte canonical                       | Nunjucks port                          |
| ----------------------- | -------------------------------------- | -------------------------------------- |
| Single file             | `.svelte` SFC                          | `.njk` macro + `.client.js` ES module  |
| Two-way binding         | `bind:value` / `$bindable()`           | `opts.value` + `onChange` callback     |
| Reactive state          | `$state`                               | DOM mutation in client.js              |
| Reactive side-effects   | `$effect`                              | `change` event listener + `setTheme()` |
| Render props / slots    | Snippet (`{#snippet children(...)}`)   | `{% call %}` caller block              |
| Stylesheet head         | `<svelte:head>`                        | `document.head.appendChild` in client.js |
| Cookie / SSR            | `hooks.server.ts` + `transformPageChunk` | Eleventy edge function or Express middleware |
| Storybook integration   | `*.stories.svelte`                     | n/a — Nunjucks doesn't have Storybook  |
| Component test runner   | vitest + svelte-testing-library        | vitest + jsdom + `nunjucks.renderString` |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause against the Svelte canonical's `spec/index.md`
§7.

### Why the split?

Nunjucks is a server-side / build-time template language. It cannot
read `localStorage`, mutate `document.head`, or hook `change`
events. The split between macro and client.js is the cleanest way
to ship both halves of the contract without inventing inline
`<script>` tags.

The macro alone is a valid, accessible static native `<select>` that
works without JavaScript (options remain selectable; form submission
would carry the chosen value). The client.js adds the apply-on-the-fly
behaviour the other framework helpers handle in a single component.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
