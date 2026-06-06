# CHANGELOG — Lily React Helpers

All notable changes to the React helpers catalog are recorded here.
The catalog follows [Semantic Versioning](https://semver.org/) at the
catalog level; individual helpers may bump independently when only
their package changes.

## [0.1.0] — 2026-06-05

### Added

- Initial catalog scaffold with two helpers:
  - [`lily-design-system-react-theme-picker`](./lily-design-system-react-theme-picker/)
    — dynamic theme CSS loader (`<link>` swap + `data-theme`).
  - [`lily-design-system-react-locale-picker`](./lily-design-system-react-locale-picker/)
    — `lang` + `dir` locale picker with BCP 47 normalisation and
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
    2.2 AAA and WAI-ARIA Radio Group contract.
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
