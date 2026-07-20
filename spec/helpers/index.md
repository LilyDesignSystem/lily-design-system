# Helpers

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Each framework ships a `*-helpers` catalog of small, opinionated, reusable packages that sit alongside the headless library; where a headless component is a pure container, a helper owns one user-preference lifecycle end to end (selection + DOM application + optional persistence). The three helpers in every catalog today are `theme-select`, `locale-select`, and `text-size-select`, each rendered as a native `<select>` control.

## Scope

This topic covers the seven `*-helpers` catalogs (angular, blazor, html, nunjucks, react, svelte, vue), the three helpers each one currently contains (theme-select, locale-select, text-size-select), their behaviour contracts, how helpers differ from the headless layer, the canonical-reference role of the svelte-helpers catalog, the per-package manifest convention (npm `package.json` vs. NuGet `.csproj` for Blazor), the dist/publish pipeline (`build.js`, `bin/publish-helpers`), and the per-helper subtree/remote layout.

It does **not** cover: the headless 490-component catalog and its rules (see [headless](../headless/index.md) and [components](../components/index.md)), the seven framework pairs and their stacks (see [frameworks](../frameworks/index.md)), theme-CSS tokens and `data-theme` semantics (see [theme](../theme/index.md)), or the `lang`/`dir` internationalisation contract (see [internationalization](../internationalization/index.md)).

## Principles and rules

- **One job per helper.** Each helper owns the entire lifecycle of one user-preference dimension (theme, language, text size) and composes cleanly with the others.
- **Higher-level than headless, not a replacement.** The headless `ThemeSelect` is a pure `<select>` container the consumer wires up; the helper adds dynamic stylesheet loading, attribute application, and persistence. Both layers can coexist in one app.
- **Native `<select>` markup.** Every helper renders one native `<select>` with one `<option>` per choice — native keyboard semantics, no custom widget code. (The original radio-group "picker" markup was migrated to `<select>` in June 2026.)
- **Headless still.** No bundled CSS, fonts, icons, or images — the consumer styles every visual aspect via a kebab-case class hook.
- **SSR-safe.** No DOM writes outside the framework's mount/effect lifecycle (`$effect` / `onMount` / equivalent).
- **i18n-clean.** Every user-facing string comes from a prop.
- **Spec-driven.** Every helper has a numbered `spec/index.md`; tests assert against those § numbers; docs link back.
- **Svelte is canonical.** The `lily-design-system-svelte-helpers` catalog is the canonical reference; the other six are framework-idiom ports.

## The seven helper catalogs

| Catalog | Manifest per package | Helpers |
| ------- | -------------------- | ------- |
| `lily-design-system-svelte-helpers` (canonical reference) | npm `package.json` | theme-select, locale-select, text-size-select |
| `lily-design-system-react-helpers` | npm `package.json` | theme-select, locale-select, text-size-select |
| `lily-design-system-vue-helpers` | npm `package.json` | theme-select, locale-select, text-size-select |
| `lily-design-system-angular-helpers` | npm `package.json` | theme-select, locale-select, text-size-select |
| `lily-design-system-html-helpers` | npm `package.json` | theme-select, locale-select, text-size-select |
| `lily-design-system-nunjucks-helpers` | npm `package.json` | theme-select, locale-select, text-size-select |
| `lily-design-system-blazor-helpers` | NuGet `.csproj` (Razor class library) | theme-select, locale-select, text-size-select |

Blazor is .NET rather than npm, so its helpers ship as Razor class libraries with a `.csproj` (e.g. `LilyDesignSystem.Blazor.ThemeSelect.csproj`) instead of a `package.json`.

## Per-package shape

Each helper subproject follows the same spec-driven shape (Svelte example; other frameworks swap the file extensions per [frameworks](../frameworks/index.md)):

| File | Purpose |
| ---- | ------- |
| `spec/index.md` (or `spec/`) | Single source of truth (numbered §; tests map to it). |
| `AGENTS.md` | AI-agent metadata pointer to `spec/index.md`. |
| `CLAUDE.md` | Loads `AGENTS.md`. |
| `index.md` | Human-readable guide. |
| `CHANGELOG.md` | Keep-a-Changelog history; catalogs at 0.2.0 (2026-07-03; initial release 0.1.0, 2026-06-05). |
| `{Pascal}.{ext}` | The component (`.svelte`, `.tsx`, `.vue`, `.component.ts`, `.razor`+`.razor.cs`, `macro.njk`). |
| `{Pascal}.test.{ext}` / `Tests.cs` | One test per acceptance clause. |
| Manifest | `package.json` (JS frameworks) or `.csproj` (Blazor). |
| `index.ts` / barrel | Re-export barrel (JS frameworks). |
| `dist/` | Build output (`build.js` per catalog; `files`/`exports` maps, `svelte` condition where relevant). |
| `docs/`, `examples/` | Topic guides and runnable examples (optional). |

Each `*-helpers` catalog directory, and each helper inside it, is its own `git subtree` pushed to a standalone remote. All 21 helper packages (7 catalogs × 3 helpers) publish via [`bin/publish-helpers`](../../bin/publish-helpers) (npm registries for the JS frameworks, NuGet for Blazor). theme-select and locale-select are at 0.2.0 (the breaking radio-group → `<select>` migration); text-size-select is at 0.1.0 (born select-based).

## theme-select contract

A drop-in headless theme selector that **loads theme CSS dynamically at runtime**.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<select class="theme-select {class}" aria-label="{label}" name="theme">` with a leading `<option class="theme-select-option theme-select-placeholder" value="">{placeholder ?? label}</option>` followed by one `<option class="theme-select-option" value="{slug}">` per theme. |
| Display | Placeholder-pinned: the element's own selection snaps back to the placeholder after every change, so the closed control always reads "Theme" and is only that wide — never as wide as the longest theme name. `selectEl.value` stays `""`; the bindable `value` prop is the active theme. Width is consumer CSS (`field-sizing: content` + a `max-width` fallback); the helper still ships zero CSS and the root `themes/` stylesheets carry the rule. |
| Required props | `label`, `themesUrl`, `themes`. Optional `placeholder` defaults to `label`. |
| CSS load | Mutates `href` on one managed `<link rel="stylesheet" data-lily-theme-select="{name}">` in `document.head`; only the active theme is fetched. URL is `normalise(themesUrl) + slug + extension`. Pairs with the root [`themes/`](../../themes/) directory of 45 reference stylesheets. |
| Activation | Sets `data-theme="{slug}"` on `target` (defaults to `document.documentElement`). |
| Persistence | Optional `localStorage[storageKey]`, written in try/catch so private-mode/quota errors are swallowed. |
| Initial value | Resolves `value` > storage > `defaultValue` > `"light"` (if present) > `themes[0]`; the word "default" is never emitted (labels are title-cased slugs or `themeLabels`). |
| SSR | All DOM writes inside the mount/effect lifecycle; server render touches no DOM. |
| Keyboard | Native `<select>` semantics — Tab in/out, Arrow to move, Home/End, first-letter typeahead. |

## locale-select contract

A drop-in headless locale selector that applies a BCP 47 locale to the document.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<select class="locale-select {class}" aria-label="{label}">` with a leading `<option class="locale-select-option locale-select-placeholder" value="">{placeholder ?? label}</option>` (no `lang`) followed by one `<option class="locale-select-option" value="{code}" lang="{bcp47}">` per locale code. |
| Display | Placeholder-pinned: the element's own selection snaps back to the placeholder after every change, so the closed control always reads "Locale" and is only that wide — never as wide as the longest locale name. `selectEl.value` stays `""`; the bindable `value` prop is the active locale. Width is consumer CSS (`field-sizing: content` + a `max-width` fallback); the helper still ships zero CSS and the root `themes/` stylesheets carry the rule. |
| Application | Sets `lang="…"` and `dir="ltr|rtl"` on the document root (or a consumer target); `applyDir` defaults to true. |
| Direction | Auto-detects RTL for Arabic, Hebrew, Thaana, Mongolian (traditional), N'Ko, Syriac, and Adlam scripts. |
| BCP 47 | Underscores in codes (`en_US`) are converted to hyphens (`en-US`) per RFC 5646 when written to `lang`; the consumer's original form round-trips losslessly. |
| Labels | Built-in 436-row locale-code → English-name table; `localeLabels` map overrides. |
| Persistence | Optional `localStorage`; optional `navigator.language` prefix-match fallback on first visit. |
| Non-goals | No translation, no locale negotiation/best-fit, no auto-discovery, no bundled translation files — it only signals the locale to the consumer's i18n library via `lang`, `onChange`, and the bindable value. |

## text-size-select contract

A drop-in headless text-size selector for reader-preference sizing.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<select class="text-size-select {class}" aria-label="{label}" name="text-size">` with one `<option class="text-size-select-option" value="{slug}">` per size. |
| Required props | `label`, `sizes`. |
| Activation | Sets `data-text-size="{slug}"` on `target` (defaults to `document.documentElement`); consumer CSS maps each value to font sizing. |
| Labels | Title-cases hyphenated slugs (`x-large` → `X Large`); `sizeLabels` map overrides. |
| Persistence | Optional `localStorage[storageKey]`, try/catch-guarded. |
| SSR | All DOM writes inside the mount/effect lifecycle. |
| Keyboard | Native `<select>` semantics. |

## Differences from the headless library

| Headless component | Helper |
| ------------------ | ------ |
| Mirrors the canonical 490-component catalog. | Small catalog of opinionated packages (currently 3). |
| Pure container, no lifecycle. | Owns the full lifecycle of one preference dimension. |
| Consumer writes their own persistence and loading. | Persistence and dynamic loading/attribute application are built in. |
| Larger, generic API. | Smaller, more opinionated API. |

## Acceptance criteria

- [x] Each of the seven framework catalogs ships `theme-select`, `locale-select`, and `text-size-select` helpers.
- [x] Every helper has a numbered `spec/index.md` and a test file asserting each acceptance clause.
- [x] JS-framework helpers ship an npm `package.json`; Blazor helpers ship a NuGet `.csproj` (Razor class library).
- [x] Every helper renders a native `<select>` with per-choice `<option>` elements and native keyboard semantics.
- [x] theme-select swaps a managed `<link>` href, sets `data-theme` on the document root, and persists optionally to `localStorage`, SSR-safe.
- [x] locale-select sets `lang` + `dir`, auto-detects RTL scripts, emits BCP 47 hyphenated tags, and performs no translation.
- [x] text-size-select sets `data-text-size` on the target and persists optionally.
- [x] theme-select and locale-select are placeholder-pinned in all seven catalogs: a leading empty-valued placeholder option carries `placeholder ?? label`, the element's own selection snaps back to it on change, and the bindable `value` prop remains the active selection.
- [x] The 45 root `themes/` stylesheets size `.theme-select` and `.locale-select` to the placeholder word via `field-sizing: content` with a `max-width` fallback.
- [x] Helpers ship no bundled CSS, fonts, icons, or images and take no hardcoded user-facing strings.
- [x] The svelte-helpers catalog is the canonical reference; the other six are idiom-faithful ports.
- [x] Each `*-helpers` catalog and each helper is a git subtree with a standalone remote.
- [x] Each helper builds a `dist/` via the catalog `build.js` and publishes via `bin/publish-helpers`.

## Related topics

- [headless](../headless/index.md) — the pure-container layer the helpers sit alongside and build on
- [frameworks](../frameworks/index.md) — the seven framework pairs whose idioms the helper ports follow
- [theme](../theme/index.md) — theme-CSS tokens, the `themes/` reference stylesheets, and `data-theme` semantics the theme-select drives
- [internationalization](../internationalization/index.md) — the `lang` / `dir` and consumer-supplied-string contract the locale-select honours
- [tooling](../tooling/index.md) — `bin/publish-helpers` and the dist pipeline

## Sources

- [lily-design-system-svelte-helpers/index.md](../../lily-design-system-svelte-helpers/index.md) — canonical catalog and conventions
- [lily-design-system-svelte-helpers/AGENTS.md](../../lily-design-system-svelte-helpers/AGENTS.md)
- [lily-design-system-svelte-helpers/lily-design-system-svelte-theme-select/](../../lily-design-system-svelte-helpers/lily-design-system-svelte-theme-select/) — theme-select contract
- [lily-design-system-svelte-helpers/lily-design-system-svelte-locale-select/](../../lily-design-system-svelte-helpers/lily-design-system-svelte-locale-select/) — locale-select contract
- [lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/](../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/) — text-size-select contract
- [bin/publish-helpers](../../bin/publish-helpers) — release pipeline
- [spec/index.md](../index.md) §3 (subproject architecture)

---

Lily™ and Lily Design System™ are trademarks.
