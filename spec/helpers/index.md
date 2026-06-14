# Helpers

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Each framework ships a `*-helpers` catalog of small, opinionated, reusable packages that sit alongside the headless library; where a headless component is a pure container, a helper owns one user-preference lifecycle end to end (selection + DOM application + optional persistence). The two helpers in every catalog today are `theme-picker` and `locale-picker`.

## Scope

This topic covers the seven `*-helpers` catalogs (angular, blazor, html, nunjucks, react, svelte, vue), the two helpers each one currently contains (theme-picker, locale-picker), their behaviour contracts, how helpers differ from the headless layer, the canonical-reference role of the svelte-helpers catalog, the per-package manifest convention (npm `package.json` vs. NuGet `.csproj` for Blazor), and the per-helper subtree/remote layout.

It does **not** cover: the headless 492-component catalog and its rules (see [headless](../headless/index.md) and [components](../components/index.md)), the seven framework pairs and their stacks (see [frameworks](../frameworks/index.md)), theme-CSS tokens and `data-theme` semantics (see [theme](../theme/index.md)), or the `lang`/`dir` internationalisation contract (see [internationalization](../internationalization/index.md)).

## Principles and rules

- **One job per helper.** Each helper owns the entire lifecycle of one user-preference dimension (theme, language) and composes cleanly with the others.
- **Higher-level than headless, not a replacement.** The headless `ThemePicker` is a pure `fieldset` + `role="radiogroup"` container; the helper adds dynamic loading, attribute application, and persistence. Both layers can coexist in one app.
- **Headless still.** No bundled CSS, fonts, icons, or images — the consumer styles every visual aspect via a kebab-case class hook.
- **SSR-safe.** No DOM writes outside the framework's mount/effect lifecycle (`$effect` / `onMount` / equivalent).
- **i18n-clean.** Every user-facing string comes from a prop.
- **Spec-driven.** Every helper has a numbered `spec.md`; tests assert against those § numbers; docs link back.
- **Svelte is canonical.** The `lily-design-system-svelte-helpers` catalog is the canonical reference; the other six are framework-idiom ports.

## The seven helper catalogs

| Catalog | Manifest per package | Helpers |
| ------- | -------------------- | ------- |
| `lily-design-system-svelte-helpers` (canonical reference) | npm `package.json` | theme-picker, locale-picker |
| `lily-design-system-react-helpers` | npm `package.json` | theme-picker, locale-picker |
| `lily-design-system-vue-helpers` | npm `package.json` | theme-picker, locale-picker |
| `lily-design-system-angular-helpers` | npm `package.json` | theme-picker, locale-picker |
| `lily-design-system-html-helpers` | npm `package.json` | theme-picker, locale-picker |
| `lily-design-system-nunjucks-helpers` | npm `package.json` | theme-picker, locale-picker |
| `lily-design-system-blazor-helpers` | NuGet `.csproj` (Razor class library) | theme-picker, locale-picker |

Blazor is .NET rather than npm, so its helpers ship as Razor class libraries with a `.csproj` (e.g. `LilyDesignSystem.Blazor.ThemePicker.csproj`) instead of a `package.json`.

## Per-package shape

Each helper subproject follows the same spec-driven shape (Svelte example; other frameworks swap the file extensions per [frameworks](../frameworks/index.md)):

| File | Purpose |
| ---- | ------- |
| `spec.md` | Single source of truth (numbered §; tests map to it). |
| `AGENTS.md` | AI-agent metadata pointer to `spec.md`. |
| `CLAUDE.md` | Loads `AGENTS.md`. |
| `index.md` | Human-readable guide. |
| `{Pascal}.{ext}` | The component (`.svelte`, `.tsx`, `.vue`, `.component.ts`, `.razor`+`.razor.cs`, `macro.njk`). |
| `{Pascal}.test.{ext}` / `Tests.cs` | One test per acceptance clause. |
| Manifest | `package.json` (JS frameworks) or `.csproj` (Blazor). |
| `index.ts` / barrel | Re-export barrel (JS frameworks). |
| `docs/`, `examples/` | Topic guides and runnable examples (optional). |

Each `*-helpers` catalog directory, and each helper inside it, is its own `git subtree` pushed to a standalone remote.

## theme-picker contract

A drop-in headless theme picker that **loads theme CSS dynamically at runtime**.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<fieldset class="theme-picker {class}" role="radiogroup" aria-label="{label}">` with one native `<input type="radio">` per theme slug. |
| Required props | `label`, `themesUrl`, `themes`. |
| CSS load | Mutates `href` on one managed `<link rel="stylesheet" data-lily-theme-picker="{name}">` in `document.head`; only the active theme is fetched. URL is `normalise(themesUrl) + slug + extension`. |
| Activation | Sets `data-theme="{slug}"` on `target` (defaults to `document.documentElement`). |
| Persistence | Optional `localStorage[storageKey]`, written in try/catch so private-mode/quota errors are swallowed. |
| Initial value | Resolves `value` > storage > `defaultValue` > `"light"` (if present) > `themes[0]`; the word "default" is never emitted (labels are title-cased slugs or `themeLabels`). |
| SSR | All DOM writes inside the mount/effect lifecycle; server render touches no DOM. |
| Keyboard | Native radio semantics — Tab in/out, Arrow to move selection, Space to select. |

## locale-picker contract

A drop-in headless locale picker that applies a BCP 47 locale to the document.

| Aspect | Contract |
| ------ | -------- |
| Markup | `<fieldset class="locale-picker …" role="radiogroup">` with one radio per locale code. |
| Application | Sets `lang="…"` and `dir="ltr|rtl"` on the document root (or a consumer target). |
| Direction | Auto-detects RTL for Arabic, Hebrew, Thaana, Mongolian (traditional), N'Ko, Syriac, and Adlam scripts. |
| BCP 47 | Underscores in codes (`en_US`) are converted to hyphens (`en-US`) per RFC 5646 when written to `lang`. |
| Persistence | Optional `localStorage`; optional `navigator.language` prefix-match fallback on first visit. |
| Non-goals | No translation, no locale negotiation/best-fit, no auto-discovery, no bundled translation files — it only signals the locale to the consumer's i18n library via `lang`, `onChange`, and the bindable value. |

## Differences from the headless library

| Headless component | Helper |
| ------------------ | ------ |
| Mirrors the canonical 492-component catalog. | Small catalog of opinionated packages (currently 2). |
| Pure container, no lifecycle. | Owns the full lifecycle of one preference dimension. |
| Consumer writes their own persistence and loading. | Persistence and dynamic loading/attribute application are built in. |
| Larger, generic API. | Smaller, more opinionated API. |

## Acceptance criteria

- [ ] Each of the seven framework catalogs ships a `theme-picker` and a `locale-picker` helper.
- [ ] Every helper has a numbered `spec.md` and a test file asserting each acceptance clause.
- [ ] JS-framework helpers ship an npm `package.json`; Blazor helpers ship a NuGet `.csproj` (Razor class library).
- [ ] theme-picker swaps a managed `<link>` href, sets `data-theme` on the document root, persists optionally to `localStorage`, is SSR-safe, and renders a `role="radiogroup"`.
- [ ] locale-picker sets `lang` + `dir`, auto-detects RTL scripts, emits BCP 47 hyphenated tags, and performs no translation.
- [ ] Helpers ship no bundled CSS, fonts, icons, or images and take no hardcoded user-facing strings.
- [ ] The svelte-helpers catalog is the canonical reference; the other six are idiom-faithful ports.
- [ ] Each `*-helpers` catalog and each helper is a git subtree with a standalone remote.

## Related topics

- [headless](../headless/index.md) — the pure-container layer the helpers sit alongside and build on
- [frameworks](../frameworks/index.md) — the seven framework pairs whose idioms the helper ports follow
- [theme](../theme/index.md) — theme-CSS tokens and `data-theme` semantics the theme-picker drives
- [internationalization](../internationalization/index.md) — the `lang` / `dir` and consumer-supplied-string contract the locale-picker honours

## Sources

- [lily-design-system-svelte-helpers/index.md](../../lily-design-system-svelte-helpers/index.md) — canonical catalog and conventions
- [lily-design-system-svelte-helpers/AGENTS.md](../../lily-design-system-svelte-helpers/AGENTS.md)
- [lily-design-system-svelte-helpers/lily-design-system-svelte-theme-picker/spec.md](../../lily-design-system-svelte-helpers/lily-design-system-svelte-theme-picker/spec.md) — theme-picker contract
- [lily-design-system-svelte-helpers/lily-design-system-svelte-locale-picker/spec.md](../../lily-design-system-svelte-helpers/lily-design-system-svelte-locale-picker/spec.md) — locale-picker contract
- [spec.md](../../spec.md) §3 (subproject architecture)
