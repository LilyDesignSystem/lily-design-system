# CHANGELOG — Lily React Helpers

All notable changes to the React helpers catalog are recorded here.
The catalog follows [Semantic Versioning](https://semver.org/) at the
catalog level; individual helpers may bump independently when only
their package changes.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.3.0**: both are now
  *placeholder-pinned*. The closed `<select>` always displays a short
  placeholder word ("Theme", "Locale") instead of the active value, so
  the control is only ever as wide as that word rather than as wide as
  the longest option. Each renders a leading placeholder `<option>` with
  an empty value, carrying a new optional `placeholder` prop (defaults
  to the existing `label`, so no user-facing string is hardcoded), and
  pins the element's own selection to it — snapping back after every
  change.
- DOM contract: option count is `choices.length + 1`, the first option's
  value is `""`, and the element's own `value` no longer tracks the
  selection. The bindable `value` prop is the single source of truth.
  Behaviour contracts (DOM application, persistence, SSR safety, i18n)
  are otherwise unchanged.
- `text-size-select` is untouched and stays at **0.1.0**.

### Added

- The compensating status region is now the default pattern in the
  examples and quick-starts: a visible `aria-live="polite"` element
  reporting the active value. It exists because placeholder-pinning
  means the control no longer announces its value to a screen reader;
  each package's `docs/accessibility.md` documents that tradeoff
  honestly rather than treating it as solved.

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

## [0.1.0] — 2026-06-05

### Added

- Initial catalog scaffold with two helpers:
  - [`lily-design-system-react-theme-select`](./lily-design-system-react-theme-select/)
    — dynamic theme CSS loader (`<link>` swap + `data-theme`).
  - [`lily-design-system-react-locale-select`](./lily-design-system-react-locale-select/)
    — `lang` + `dir` locale select with BCP 47 normalisation and
    optional `navigator.languages` detection.
- Parent README (`index.md`) describing the catalog conventions:
  React 19 function components, `"use client"` directive, controlled
  vs uncontrolled `value`, render-prop `children`, rest-prop spread,
  no bundled CSS, no hardcoded user-facing strings.
- Cross-framework AGENTS files at the catalog root:
  - [`AGENTS.md`](./AGENTS.md) — catalog pointer.
  - [`AGENTS/conventions.md`](./AGENTS/conventions.md) — React 19
    idioms used across the catalog.
  - [`AGENTS/testing.md`](./AGENTS/testing.md) — vitest + jsdom +
    `@testing-library/react` conventions.
  - [`AGENTS/accessibility.md`](./AGENTS/accessibility.md) — WCAG
    2.2 AAA and the native `<select>` contract.
  - [`AGENTS/ssr.md`](./AGENTS/ssr.md) — Next.js App Router, Remix,
    Vite SSR, React Server Components.
  - [`AGENTS/shared/headless-principles.md`](./AGENTS/shared/headless-principles.md)
    — React adaptation of the cross-framework headless rules.
  - [`AGENTS/shared/i18n-principles.md`](./AGENTS/shared/i18n-principles.md)
    — React adaptation of the cross-framework i18n rules.
  - [`AGENTS/shared/theme-principles.md`](./AGENTS/shared/theme-principles.md)
    — React adaptation of the cross-framework theme rules.

### Implementation parity with `lily-design-system-svelte-helpers`

- Both helpers mirror the Svelte counterparts byte-for-byte in
  behaviour, DOM contract, spec numbering, and acceptance criteria.
- `locales.ts` and `locales.tsv` are byte-identical to the Svelte
  version (436 locale codes, English names, RTL sets).
- Pure helpers (`themeHref`, `normalizeThemesUrl`, `bcp47LocaleTag`,
  `isRtlLocale`, `localeName`, `matchNavigatorLanguage`) match
  signature and behaviour.

### Differences from the Svelte helpers

Documented in [`index.md` § Differences from the Svelte helpers](./index.md#differences-from-the-svelte-helpers).
Summary: React 19 hooks instead of Svelte runes; controlled
`value` + `onChange` instead of `bind:value={…}`; render-prop
`children` instead of `Snippet<[ChildArgs]>`; `"use client"`
directive for the SSR boundary; cookie persistence via Next.js
App Router server components / actions instead of SvelteKit hooks.
