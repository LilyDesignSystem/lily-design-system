# Framework helpers design principle rules

Each framework ships a `*-helpers` catalog of small, opinionated packages that sit alongside the headless library. Where a headless component is a pure container, a helper owns one user-preference lifecycle end to end: selection + DOM application + optional persistence.

Full contracts: [spec/helpers/index.md](../spec/helpers/index.md).

## The three helpers

Every catalog (html, svelte, react, vue, angular, blazor, nunjucks) ships:

| Helper | Root markup | Applies | Persists |
| ------ | ----------- | ------- | -------- |
| `theme-select` | `<select class="theme-select {class}" aria-label="{label}">` | Swaps a managed `<link rel="stylesheet" data-lily-theme-select>` href and sets `data-theme` on the document root; pairs with the root `themes/` stylesheets. | Optional `localStorage`. |
| `locale-select` | `<select class="locale-select {class}" aria-label="{label}">` | Sets `lang` (BCP 47, hyphenated) and `dir` (`ltr`/`rtl` auto-detected per script) on the document root. No translation. | Optional `localStorage`; optional `navigator.language` first-visit fallback. |
| `text-size-select` | `<select class="text-size-select {class}" aria-label="{label}">` | Sets `data-text-size` on the document root; consumer CSS maps values to sizing. | Optional `localStorage`. |

## Rules

- **Native `<select>` only.** One `<option class="{helper}-option">` per choice; native keyboard semantics. The June 2026 migration replaced the earlier radio-group "picker" markup — do not reintroduce it.
- **Headless still.** No bundled CSS, fonts, icons, images; kebab-case class hook + consumer `class` pass-through; rest-props spread on the root.
- **SSR-safe.** DOM writes only inside the framework's mount/effect lifecycle.
- **i18n-clean.** Every user-facing string is a prop; labels default to title-cased slugs with an override map (`themeLabels` / `localeLabels` / `sizeLabels`).
- **Spec-driven.** Each helper has a numbered `spec/index.md`; one test per acceptance clause.
- **Svelte is canonical.** Port contracts from `lily-design-system-svelte-helpers`; when catalogs disagree, the Svelte side wins.
- **Publishing.** Each helper is an npm package (`package.json`, `dist/` via the catalog `build.js`) — NuGet `.csproj` for Blazor — released with `bin/publish-helpers`. Each catalog and each helper is its own git subtree.
