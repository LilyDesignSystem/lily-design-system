# Helpers

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Each framework ships a `*-helpers` catalog of small, opinionated, reusable packages that sit alongside the headless library; where a headless component is a pure container, a helper owns one user-preference lifecycle end to end (selection + DOM application + optional persistence). The three helpers in every catalog today are `theme-chooser`, `locale-chooser`, and `text-size-chooser`, each rendered as a single-glyph icon button that opens a WAI-ARIA APG listbox.

## Scope

This topic covers the seven `*-helpers` catalogs (angular, blazor, html, nunjucks, react, svelte, vue), the three helpers each one currently contains (theme-chooser, locale-chooser, text-size-chooser), their behaviour contracts, how helpers differ from the headless layer, the canonical-reference role of the svelte-helpers catalog, the per-package manifest convention (npm `package.json` vs. NuGet `.csproj` for Blazor), the dist/publish pipeline (`build.js`, `bin/publish-helpers`), and the per-helper subtree/remote layout.

It does **not** cover: the headless 490-component catalog and its rules (see [headless](../headless/index.md) and [components](../components/index.md)), the seven framework pairs and their stacks (see [frameworks](../frameworks/index.md)), theme-CSS tokens and `data-theme` semantics (see [theme](../theme/index.md)), or the `lang`/`dir` internationalisation contract (see [internationalization](../internationalization/index.md)).

## Principles and rules

- **One job per helper.** Each helper owns the entire lifecycle of one user-preference dimension (theme, language, text size) and composes cleanly with the others.
- **Higher-level than headless, not a replacement.** The headless `ThemeSelect` is a pure `<select>` container the consumer wires up; the helper adds dynamic stylesheet loading, attribute application, and persistence. Both layers can coexist in one app.
- **Icon button + listbox markup.** Every helper renders a `<button>` carrying an `aria-hidden` glyph, which opens a `role="listbox"` popup implementing the APG keyboard contract. The native keyboard semantics of a `<select>` are therefore hand-rolled, which is a real cost — see each package's `docs/accessibility.md`. (History: radio-group "picker" → native `<select>` in June 2026 → icon button + listbox in July 2026. The picker markup must not be reintroduced.)
- **Headless still.** No bundled CSS, fonts, icons, or images — the consumer styles every visual aspect via a kebab-case class hook.
- **SSR-safe.** No DOM writes outside the framework's mount/effect lifecycle (`$effect` / `onMount` / equivalent).
- **i18n-clean.** Every user-facing string comes from a prop.
- **Spec-driven.** Every helper has a numbered `spec/index.md`; tests assert against those § numbers; docs link back.
- **Svelte is canonical.** The `lily-design-system-svelte-helpers` catalog is the canonical reference; the other six are framework-idiom ports.

## The seven helper catalogs

| Catalog | Manifest per package | Helpers |
| ------- | -------------------- | ------- |
| `lily-design-system-svelte-helpers` (canonical reference) | npm `package.json` | theme-chooser, locale-chooser, text-size-chooser |
| `lily-design-system-react-helpers` | npm `package.json` | theme-chooser, locale-chooser, text-size-chooser |
| `lily-design-system-vue-helpers` | npm `package.json` | theme-chooser, locale-chooser, text-size-chooser |
| `lily-design-system-angular-helpers` | npm `package.json` | theme-chooser, locale-chooser, text-size-chooser |
| `lily-design-system-html-helpers` | npm `package.json` | theme-chooser, locale-chooser, text-size-chooser |
| `lily-design-system-nunjucks-helpers` | npm `package.json` | theme-chooser, locale-chooser, text-size-chooser |
| `lily-design-system-blazor-helpers` | NuGet `.csproj` (Razor class library) | theme-chooser, locale-chooser, text-size-chooser |

Blazor is .NET rather than npm, so its helpers ship as Razor class libraries with a `.csproj` (e.g. `LilyDesignSystem.Blazor.ThemeSelect.csproj`) instead of a `package.json`.

## Per-package shape

Each helper subproject follows the same spec-driven shape (Svelte example; other frameworks swap the file extensions per [frameworks](../frameworks/index.md)):

| File | Purpose |
| ---- | ------- |
| `spec/index.md` (or `spec/`) | Single source of truth (numbered §; tests map to it). |
| `AGENTS.md` | AI-agent metadata pointer to `spec/index.md`. |
| `CLAUDE.md` | Loads `AGENTS.md`. |
| `index.md` | Human-readable guide. |
| `CHANGELOG.md` | Keep-a-Changelog history. Every helper package restarts at 0.1.0 (2026-07-21) under its `*-chooser` name; the pre-rename history is preserved below a provenance heading in each file. |
| `{Pascal}.{ext}` | The component (`.svelte`, `.tsx`, `.vue`, `.component.ts`, `.razor`+`.razor.cs`, `macro.njk`). |
| `{Pascal}.test.{ext}` / `Tests.cs` | One test per acceptance clause. |
| Manifest | `package.json` (JS frameworks) or `.csproj` (Blazor). |
| `index.ts` / barrel | Re-export barrel (JS frameworks). |
| `dist/` | Build output (`build.js` per catalog; `files`/`exports` maps, `svelte` condition where relevant). |
| `docs/`, `examples/` | Topic guides and runnable examples (optional). |

Each `*-helpers` catalog directory, and each helper inside it, is its own `git subtree` pushed to a standalone remote. All 28 helper packages (7 catalogs × 4 helpers) publish via [`bin/publish-helpers`](../../bin/publish-helpers) (npm registries for the JS frameworks, NuGet for Blazor).

Every package is at **0.1.0**. The July 2026 rename from `*-select` / `*-button` to `*-chooser` changed the published package names, and a renamed package has no history under its new name — numbering the first release 0.4.0 would imply three releases that never existed. Nothing had been published, so the reset cost nothing. The in-tree history (radio-group picker → native `<select>` → placeholder-pinned `<select>` → icon button + listbox) is preserved in each package's CHANGELOG under a provenance heading.

## theme-chooser contract

A drop-in headless theme selector that **loads theme CSS dynamically at runtime**.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<div class="theme-chooser {class}">` containing a hidden input (carries `name`), `<button class="theme-chooser-button" aria-label="{label}" aria-haspopup="listbox" aria-expanded aria-controls>` whose only content is an `aria-hidden` `<span class="theme-chooser-icon">◑</span>` (U+25D1), and `<ul class="theme-chooser-list" role="listbox" tabindex="-1" hidden>` of `<li class="theme-chooser-option" role="option" aria-selected>`. |
| Display | A single-glyph button — the smallest footprint a header control can have, and narrower than any text label. The glyph is decorative (`aria-hidden`); the accessible name is the button's `aria-label`. The consumer's `children` slot replaces the glyph, not the options. |
| Required props | `label`, `themesUrl`, `themes`. Optional `detectFromSystem` resolves `prefers-color-scheme` on first visit. |
| CSS load | Mutates `href` on one managed `<link rel="stylesheet" data-lily-theme-chooser="{name}">` in `document.head`; only the active theme is fetched. URL is `normalise(themesUrl) + slug + extension`. Pairs with the root [`themes/`](../../themes/) directory of 45 reference stylesheets. |
| Activation | Sets `data-theme="{slug}"` on `target` (defaults to `document.documentElement`). |
| Persistence | Optional `localStorage[storageKey]`, written in try/catch so private-mode/quota errors are swallowed. |
| Initial value | Resolves `value` > storage > `detectFromSystem` > `defaultValue` > `"light"` (if present) > `themes[0]`; the word "default" is never emitted (labels come from the exported `themeName` or `themeLabels`). |
| SSR | All DOM writes inside the mount/effect lifecycle; server render touches no DOM. |
| Keyboard | WAI-ARIA APG listbox. Button: ArrowDown / ArrowUp / Enter / Space open (ArrowUp starts on the last option). List: arrows move and clamp, Home/End jump, printable characters typeahead over labels, Enter/Space select and return focus to the button, Escape closes without changing the value, Tab closes and moves on. |

## locale-chooser contract

A drop-in headless locale selector that applies a BCP 47 locale to the document.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<div class="locale-chooser {class}">` containing a hidden input (carries `name`), `<button class="locale-chooser-button" aria-label="{label}" aria-haspopup="listbox" aria-expanded aria-controls>` whose only content is an `aria-hidden` `<span class="locale-chooser-icon">🌐</span>` (U+1F310 + U+FE0E for text presentation), and `<ul class="locale-chooser-list" role="listbox" tabindex="-1" hidden>` of `<li class="locale-chooser-option" role="option" aria-selected lang="{bcp47}">`. |
| Display | A single-glyph button, symmetric with theme-chooser. The glyph is decorative (`aria-hidden`); the accessible name is the button's `aria-label`. Keyboard follows the same APG listbox contract as theme-chooser. |
| Application | Sets `lang="…"` and `dir="ltr|rtl"` on the document root (or a consumer target); `applyDir` defaults to true. |
| Direction | Auto-detects RTL for Arabic, Hebrew, Thaana, Mongolian (traditional), N'Ko, Syriac, and Adlam scripts. |
| BCP 47 | Underscores in codes (`en_US`) are converted to hyphens (`en-US`) per RFC 5646 when written to `lang`; the consumer's original form round-trips losslessly. |
| Labels | Built-in 436-row locale-code → English-name table; `localeLabels` map overrides. |
| Persistence | Optional `localStorage`; optional `navigator.language` prefix-match fallback on first visit. |
| Non-goals | No translation, no locale negotiation/best-fit, no auto-discovery, no bundled translation files — it only signals the locale to the consumer's i18n library via `lang`, `onChange`, and the bindable value. |

## share-chooser contract

An action helper rather than a preference helper: it applies nothing to
the document and persists nothing. Svelte catalog only, for now.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<div class="share-chooser {class}">` containing `<button class="share-chooser-button" aria-label aria-expanded aria-controls>` whose only content is an `aria-hidden` `<span class="share-chooser-icon">➤</span>` (U+27A4), a `<ul class="share-chooser-list" hidden>` of `<li>` holding `<a class="share-chooser-target">` destinations and an optional `<button class="share-chooser-copy">`, and a `<p class="share-chooser-status" aria-live="polite">`. |
| Pattern | **Disclosure, not menu or listbox.** Destinations are navigation, so they are real links with no `role` override — `role="menuitem"` would strip middle-click, open-in-new-tab and copy-link-address, and the APG suggests a disclosure when items are links. |
| Required props | `label`. `targets` and `copyLabel` are both optional, but at least one is needed for the list to have contents. |
| Destinations | Consumer-supplied. Each `ShareTarget` carries `id`, `label`, and `href(url, title, text)`. **No social-network endpoints ship with the package** — an editorial and privacy decision that belongs to the consumer, and the URLs change. |
| Native sheet | `strategy: "auto"` (default) calls `navigator.share` when it exists and skips the list; `"native"` always tries; `"list"` never does. A rejected (dismissed) sheet ends the interaction rather than falling through to the list. |
| Copy | `navigator.clipboard.writeText(url)`; success fires `onCopy` and announces `copiedLabel`, failure announces `copyFailedLabel` and never throws. The copy item renders only when `copyLabel` is supplied — a default would be hardcoded English. |
| URL | `url` defaults to the current page, resolved lazily so SSR never touches `location`. |
| Keyboard | Arrows move focus between items and clamp; Home/End jump; Escape closes and returns focus to the trigger; Tab closes and moves on. Items are real focusable elements, so focus moves for real rather than via `aria-activedescendant`. |
| Class-hook exception | The trigger is `share-chooser-trigger`, not `share-chooser-button`, since `.share-chooser-button` reads badly. |

## text-size-chooser contract

A drop-in headless text-size selector for reader-preference sizing.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<div class="text-size-chooser {class}">` containing a hidden input (carries `name`), `<button class="text-size-chooser-button" aria-label="{label}" aria-haspopup="listbox" aria-expanded aria-controls>` whose only content is an `aria-hidden` `<span class="text-size-chooser-icon">A</span>` (U+0041), and `<ul class="text-size-chooser-list" role="listbox" tabindex="-1" hidden>` of `<li class="text-size-chooser-option" role="option" aria-selected>`. |
| Display | A single-glyph button, symmetric with theme-chooser and locale-chooser. "A" is a plain in-font letter rather than a pictograph: U+1F5DB (DECREASE FONT SIZE SYMBOL) was rejected because it falls back to a crude bitmap glyph in common font stacks and means *decrease* rather than *size*. |
| Required props | `label`, `sizes`. |
| Activation | Sets `data-text-size="{slug}"` on `target` (defaults to `document.documentElement`); consumer CSS maps each value to font sizing. |
| Labels | The exported `sizeName` title-cases hyphenated slugs (`x-large` → `X Large`), mirroring `themeName` / `localeName`; `sizeLabels` map overrides. |
| Persistence | Optional `localStorage[storageKey]`, try/catch-guarded. |
| SSR | All DOM writes inside the mount/effect lifecycle. |
| Keyboard | WAI-ARIA APG listbox, identical to the other two helpers. Button: ArrowDown / ArrowUp / Enter / Space open (ArrowUp starts on the last option). List: arrows move and clamp, Home/End jump, printable characters typeahead over labels, Enter/Space select and return focus to the button, Escape closes without changing the value, Tab closes and moves on. |
| No detection | Unlike theme-chooser (`detectFromSystem`) and locale-chooser (`detectFromNavigator`), there is no first-visit detection: no OS-level "preferred text size" is exposed to the web platform. |

## Differences from the headless library

| Headless component | Helper |
| ------------------ | ------ |
| Mirrors the canonical 490-component catalog. | Small catalog of opinionated packages (currently 3). |
| Pure container, no lifecycle. | Owns the full lifecycle of one preference dimension. |
| Consumer writes their own persistence and loading. | Persistence and dynamic loading/attribute application are built in. |
| Larger, generic API. | Smaller, more opinionated API. |

## Acceptance criteria

- [x] Each of the seven framework catalogs ships `theme-chooser`, `locale-chooser`, and `text-size-chooser` helpers. The Svelte catalog additionally ships `share-chooser`; porting it to the other six is open work.
- [x] Every helper has a numbered `spec/index.md` and a test file asserting each acceptance clause.
- [x] JS-framework helpers ship an npm `package.json`; Blazor helpers ship a NuGet `.csproj` (Razor class library).
- [x] Every helper renders an icon button plus a `role="listbox"` popup with per-choice `role="option"` items.
- [x] theme-chooser swaps a managed `<link>` href, sets `data-theme` on the document root, and persists optionally to `localStorage`, SSR-safe.
- [x] locale-chooser sets `lang` + `dir`, auto-detects RTL scripts, emits BCP 47 hyphenated tags, and performs no translation.
- [x] text-size-chooser sets `data-text-size` on the target and persists optionally, and renders the same icon-button + listbox shape as the other two.
- [x] All three helpers render an icon button + APG listbox in all seven catalogs — ◑ (U+25D1), 🌐 (U+1F310 + U+FE0E), "A" (U+0041), optically matched via `--lily-select-icon-scale`.
- [x] All three icon-button helpers implement the full APG listbox keyboard contract (open keys, clamped arrows, Home/End, typeahead, Enter/Space select with focus return, Escape without change, Tab passthrough), verified in a real browser as well as in unit tests.
- [x] The glyph is `aria-hidden` and the accessible name comes from `aria-label`; the `children` slot overrides the glyph, not the options.
- [x] The helpers are symmetric: matching exported label resolvers (`themeName` / `localeName` / `sizeName`), matching monochrome glyph presentation, and matching doc + example file shape. theme-chooser and locale-chooser additionally match on first-visit detection (`detectFromSystem` / `detectFromNavigator`) at the same position in the resolution order; text-size-chooser has no equivalent to detect.
- [x] The 45 root `themes/` stylesheets style the button and popup. The `:has(> .{helper}-button)` guard they used to need is gone: it existed only to separate the helpers from the catalog `theme-select` component, which shared the `.theme-select` hook, and the July 2026 rename to `*-chooser` removed the collision outright.
- [x] Helpers ship no bundled CSS, fonts, icons, or images and take no hardcoded user-facing strings — nor, in `share-chooser`'s case, any third-party endpoint.
- [x] `share-chooser` renders a disclosure of real links plus a clipboard action, announces the copy outcome politely, and prefers the native share sheet where the platform has one.
- [x] The svelte-helpers catalog is the canonical reference; the other six are idiom-faithful ports.
- [x] Each `*-helpers` catalog and each helper is a git subtree with a standalone remote.
- [x] Each helper builds a `dist/` via the catalog `build.js` and publishes via `bin/publish-helpers`.

## Related topics

- [headless](../headless/index.md) — the pure-container layer the helpers sit alongside and build on
- [frameworks](../frameworks/index.md) — the seven framework pairs whose idioms the helper ports follow
- [theme](../theme/index.md) — theme-CSS tokens, the `themes/` reference stylesheets, and `data-theme` semantics the theme-chooser drives
- [internationalization](../internationalization/index.md) — the `lang` / `dir` and consumer-supplied-string contract the locale-chooser honours
- [tooling](../tooling/index.md) — `bin/publish-helpers` and the dist pipeline

## Sources

- [lily-design-system-svelte-helpers/index.md](../../lily-design-system-svelte-helpers/index.md) — canonical catalog and conventions
- [lily-design-system-svelte-helpers/AGENTS.md](../../lily-design-system-svelte-helpers/AGENTS.md)
- [lily-design-system-svelte-helpers/lily-design-system-svelte-theme-chooser/](../../lily-design-system-svelte-helpers/lily-design-system-svelte-theme-chooser/) — theme-chooser contract
- [lily-design-system-svelte-helpers/lily-design-system-svelte-locale-chooser/](../../lily-design-system-svelte-helpers/lily-design-system-svelte-locale-chooser/) — locale-chooser contract
- [lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-chooser/](../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-chooser/) — text-size-chooser contract
- [bin/publish-helpers](../../bin/publish-helpers) — release pipeline
- [spec/index.md](../index.md) §3 (subproject architecture)

---

Lily™ and Lily Design System™ are trademarks.
