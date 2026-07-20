# Framework helpers design principle rules

Each framework ships a `*-helpers` catalog of small, opinionated packages that sit alongside the headless library. Where a headless component is a pure container, a helper owns one user-preference lifecycle end to end: selection + DOM application + optional persistence.

Full contracts: [spec/helpers/index.md](../spec/helpers/index.md).

## The three helpers

Every catalog (html, svelte, react, vue, angular, blazor, nunjucks) ships:

| Helper | Root markup | Applies | Persists |
| ------ | ----------- | ------- | -------- |
| `theme-select` | Icon button (◑ U+25D1) + listbox, rooted on `<div class="theme-select {class}">` | Swaps a managed `<link rel="stylesheet" data-lily-theme-select>` href and sets `data-theme` on the document root; pairs with the root `themes/` stylesheets. | Optional `localStorage`. |
| `locale-select` | Icon button (🌐 U+1F310) + listbox, rooted on `<div class="locale-select {class}">` | Sets `lang` (BCP 47, hyphenated) and `dir` (`ltr`/`rtl` auto-detected per script) on the document root. No translation. | Optional `localStorage`; optional `navigator.language` first-visit fallback. |
| `text-size-select` | `<select class="text-size-select {class}" aria-label="{label}">` | Sets `data-text-size` on the document root; consumer CSS maps values to sizing. | Optional `localStorage`. |

## Rules

- **Two shapes, deliberately.** `text-size-select` is a **native `<select>`** with one `<option class="text-size-select-option">` per choice — native keyboard semantics, nothing hand-rolled. `theme-select` and `locale-select` are an **icon button that opens a listbox**, because a single glyph is the smallest possible footprint for a control that sits in a page header. Neither shape may use the radio-group "picker" markup the June 2026 migration removed — do not reintroduce it.
- **Icon button + listbox contract (`theme-select`, `locale-select`).** Root `<div class="{helper} {class}">` containing a hidden input (form participation, carries `name`), a `<button class="{helper}-button" type="button" aria-label aria-haspopup="listbox" aria-expanded aria-controls>` whose only content is an `aria-hidden` glyph span, and a `<ul class="{helper}-list" role="listbox" tabindex="-1" hidden>` of `<li class="{helper}-option" role="option" aria-selected>`. Keyboard follows the WAI-ARIA APG listbox pattern: the open keys are ArrowDown / ArrowUp / Enter / Space, focus moves to the list, the cursor is `aria-activedescendant` (mirrored to `data-active` for CSS), arrows clamp rather than wrap, Home / End jump, printable characters typeahead over labels, Enter / Space select and return focus to the button, Escape closes without changing the value, Tab closes and moves on. The consumer's `children` slot replaces the **glyph**, not the options.
- **The glyph is decorative.** It is wrapped in `aria-hidden="true"`; the accessible name comes from the button's `aria-label`. Never let a glyph be the accessible name — and remember the glyph is a font-dependent character, not a bundled asset.
- **Headless still.** No bundled CSS, fonts, icons, images; kebab-case class hook + consumer `class` pass-through; rest-props spread on the root.
- **SSR-safe.** DOM writes only inside the framework's mount/effect lifecycle.
- **i18n-clean.** Every user-facing string is a prop; labels default to title-cased slugs with an override map (`themeLabels` / `localeLabels` / `sizeLabels`).
- **Spec-driven.** Each helper has a numbered `spec/index.md`; one test per acceptance clause.
- **Svelte is canonical.** Port contracts from `lily-design-system-svelte-helpers`; when catalogs disagree, the Svelte side wins.
- **Publishing.** Each helper is an npm package (`package.json`, `dist/` via the catalog `build.js`) — NuGet `.csproj` for Blazor — released with `bin/publish-helpers`. Each catalog and each helper is its own git subtree.
