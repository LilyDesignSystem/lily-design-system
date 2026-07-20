# Changelog — Lily Design System Nunjucks Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- **All three helpers** are no longer native `<select>` elements. Each
  is now an **icon button that opens a dropdown listbox**: a `<div>`
  root containing a hidden `<input>`, a glyph-only `<button>` (U+25D1
  for theme, U+1F310 for locale, U+0041 "A" for text size), and a
  `<ul role="listbox" hidden>` of `<li role="option">`. The client
  modules gained the full WAI-ARIA APG listbox keyboard contract.
- `theme-select` and `locale-select` converted first; `text-size-select`
  joins them here, so the catalog is once again internally consistent.
- This **supersedes the 0.3.0 placeholder-pinning work** in theme-select
  and locale-select: with no `<select>` there is nothing to pin, so the
  `placeholder` opt and the `{helper}-placeholder` class hook are
  removed from both. `text-size-select` never had a `placeholder` opt.
- `text-size-select` gains a hidden `<input name="{name}">` for form
  participation. The `name` opt now names that input rather than the
  `<select>`; its default is still `"text-size"`.

### Note on the text-size glyph

The button glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A), not a
pictograph. U+1F5DB DECREASE FONT SIZE SYMBOL was the first choice but
has no real glyph in common font stacks — it degrades to a crude bitmap
shape — and it means *decrease* rather than *size*. "A" renders in the
page's own font everywhere, stays monochrome like theme-select's ◑, and
is the conventional text-size affordance. It is materially safer than a
pictograph against the "glyph may not render" tradeoff.

`text-size-select` deliberately gains **no** detection prop. Unlike
`prefers-color-scheme` (theme) and `navigator.languages` (locale), the
web platform exposes no OS "preferred text size" signal.

### Added

- New class hooks on all three helpers: `{helper}-button`,
  `{helper}-icon`, `{helper}-list`, `{helper}-option`, plus
  `[data-active]` and `[aria-selected]` state hooks. The packages ship
  no positioning CSS for the listbox; that is the consumer's job.
- New `id` macro opt on all three helpers, defaulting to
  `{helper}-{name}`, giving deterministic SSR-safe ids for the listbox
  and its options. A Nunjucks macro cannot hold an incrementing module
  counter the way the canonical Svelte helper does, so this parameter
  is the framework's stable-id mechanism; two instances sharing a
  `name` need distinct `id`s.
- The `{% call %}` block on all three helpers now overrides the
  button's glyph — the Nunjucks equivalent of the canonical helper's
  `children`.
- `text-size-select.client.js` exports `sizeName(slug)` and
  `LATIN_CAPITAL_LETTER_A`, mirroring theme-select's `themeName` /
  `CIRCLE_WITH_RIGHT_HALF_BLACK` and locale-select's `localeName`.
  `sizeName` title-cases hyphen-separated words (`"x-large"` →
  `"X Large"`). As with the other two helpers, the macro cannot call
  into the client module — delegating would force every consumer to
  register a custom Nunjucks filter — so the macro restates the rule in
  template syntax and a test holds the two in agreement.
- `text-size-select` now emits `data-lily-text-size-select-value` for
  `opts.value`, the same out-of-band mechanism the other two use to
  avoid a pre-hydration flash.

### Regression (documented, not fixed)

- **No helper in this catalog works without JavaScript any more.**
  Every button has no handler and every listbox renders `hidden`, so
  with JS disabled the user cannot change theme, locale, or text size.
  The native `<select>` elements they replaced were fully operable with
  no JS whatsoever. The pre-filled hidden input keeps form submission
  working but is not a choice path. Each package's `docs/ssr.md` states
  this plainly and points at the alternative.
- This regression is worth weighing especially carefully for
  `text-size-select`, whose entire purpose is WCAG 1.4.4 (Resize Text)
  — the users most likely to need it overlap with users on constrained
  or assistive setups. `docs/accessibility.md` says so directly.

### Unchanged

- `data-lily-{theme,locale,text-size}-select-value` remain the sole
  channel by which `opts.value` reaches each client, and still prevent
  a pre-hydration flash.
- All downstream behaviour: the managed `<link>` swap, `data-theme`,
  `lang` / `dir`, RTL detection, `data-text-size` application,
  `localStorage` persistence, navigator detection, `onChange`,
  initial-value resolution, SSR safety, and every exported pure helper.
- `text-size-select`'s initial-value order is unchanged
  (`value > storage > defaultValue > "medium" > sizes[0]`). Unlike
  theme-select, `value` already beat storage here, so there is no
  precedence reversal and no migration warning.

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
