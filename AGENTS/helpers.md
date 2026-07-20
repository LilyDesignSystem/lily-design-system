# Framework helpers design principle rules

Each framework ships a `*-helpers` catalog of small, opinionated packages that sit alongside the headless library. Where a headless component is a pure container, a helper owns one complete interaction end to end. Most own a **user preference** — selection + DOM application + optional persistence. `share-button` owns an **action** instead: it applies nothing to the document and persists nothing. Both are helpers because they ship the same headless contract and own the whole interaction, not because they share a lifecycle.

Full contracts: [spec/helpers/index.md](../spec/helpers/index.md).

## The helpers

Every catalog (html, svelte, react, vue, angular, blazor, nunjucks) ships the three preference helpers. `share-button` currently exists in the Svelte catalog only:

| Helper | Root markup | Applies | Persists |
| ------ | ----------- | ------- | -------- |
| `theme-select` | Icon button (◑ U+25D1) + listbox, rooted on `<div class="theme-select {class}">` | Swaps a managed `<link rel="stylesheet" data-lily-theme-select>` href and sets `data-theme` on the document root; pairs with the root `themes/` stylesheets. | Optional `localStorage`. |
| `locale-select` | Icon button (🌐 U+1F310) + listbox, rooted on `<div class="locale-select {class}">` | Sets `lang` (BCP 47, hyphenated) and `dir` (`ltr`/`rtl` auto-detected per script) on the document root. No translation. | Optional `localStorage`; optional `navigator.language` first-visit fallback. |
| `text-size-select` | Icon button ("A" U+0041) + listbox, rooted on `<div class="text-size-select {class}">` | Sets `data-text-size` on the document root; consumer CSS maps values to sizing. | Optional `localStorage`. |
| `share-button` (svelte only) | Icon button ("↪" U+21AA) + disclosure list of real links, rooted on `<div class="share-button {class}">` | Nothing — opens the native share sheet where available, else a list of consumer-supplied destinations plus copy-to-clipboard. | None. |

## Rules

- **One shape, across all three.** `theme-select`, `locale-select` and `text-size-select` are each an **icon button that opens a listbox**, because a single glyph is the smallest possible footprint for a control that sits in a page header. None of them may use the radio-group "picker" markup the June 2026 migration removed — do not reintroduce it. (text-size-select was the last native `<select>`; it joined the other two in 0.2.0 of that package.)
- **Icon button + listbox contract (all three).** Root `<div class="{helper} {class}">` containing a hidden input (form participation, carries `name`), a `<button class="{helper}-button" type="button" aria-label aria-haspopup="listbox" aria-expanded aria-controls>` whose only content is an `aria-hidden` glyph span, and a `<ul class="{helper}-list" role="listbox" tabindex="-1" hidden>` of `<li class="{helper}-option" role="option" aria-selected>`. Keyboard follows the WAI-ARIA APG listbox pattern: the open keys are ArrowDown / ArrowUp / Enter / Space, focus moves to the list, the cursor is `aria-activedescendant` (mirrored to `data-active` for CSS), arrows clamp rather than wrap, Home / End jump, printable characters typeahead over labels, Enter / Space select and return focus to the button, Escape closes without changing the value, Tab closes and moves on. The consumer's `children` slot replaces the **glyph**, not the options.
- **`share-button` is a disclosure, not a listbox.** Its destinations are navigation, so they are real `<a>` elements: `role="menuitem"` would strip middle-click, open-in-new-tab and copy-link-address, and the APG itself suggests a disclosure when the items are links. Copy is a real `<button>`. Its trigger hook is `share-button-trigger` rather than `share-button-button`, the one deliberate bend in the `{helper}-button` convention.
- **`share-button` ships no endpoints.** No social-network URLs are bundled: which networks belong in a product is an editorial and privacy decision, and share URLs change. The consumer passes `targets`, each with its own `href(url, title, text)`.
- **The glyph is decorative.** It is wrapped in `aria-hidden="true"`; the accessible name comes from the button's `aria-label`. Never let a glyph be the accessible name — and remember the glyph is a font-dependent character, not a bundled asset. The glyphs are ◑ (U+25D1), 🌐 (U+1F310 + U+FE0E for text presentation), "A" (U+0041), and ↪ (U+21AA). Prefer characters with real glyphs in ordinary font stacks: U+1F5DB was rejected for text-size because it falls back to a crude bitmap shape and means *decrease* rather than *size*.
- **Glyphs are optically matched, not merely equal-sized.** Different characters ink different fractions of their em box (◑ 0.842, 🌐 0.996, "A" 0.673, ↪ 0.633), so a single `font-size` looks wrong. The 45 `themes/*.css` correct each one via `--lily-select-icon-scale` (1, 0.845, 1.25, 1.331). Measure against the icon's *computed* `font-family`, not a bare `system-ui` probe — the latter gives materially different ratios.
- **Headless still.** No bundled CSS, fonts, icons, images; kebab-case class hook + consumer `class` pass-through; rest-props spread on the root.
- **SSR-safe.** DOM writes only inside the framework's mount/effect lifecycle.
- **i18n-clean.** Every user-facing string is a prop; labels default to title-cased slugs with an override map (`themeLabels` / `localeLabels` / `sizeLabels`).
- **Spec-driven.** Each helper has a numbered `spec/index.md`; one test per acceptance clause.
- **Svelte is canonical.** Port contracts from `lily-design-system-svelte-helpers`; when catalogs disagree, the Svelte side wins.
- **Publishing.** Each helper is an npm package (`package.json`, `dist/` via the catalog `build.js`) — NuGet `.csproj` for Blazor — released with `bin/publish-helpers`. Each catalog and each helper is its own git subtree.
