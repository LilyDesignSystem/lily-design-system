# CHANGELOG — lily-design-system-react-locale-picker

## [0.1.0] — 2026-06-05

### Added

- Initial implementation of `LocalePicker` for React 19.
- `LocalePicker.tsx` — function component with hooks
  (`useState`, `useEffect`, `useRef`). Carries the `"use client"`
  directive. Writes `lang` (BCP 47 hyphen form) and `dir` (`"rtl"` /
  `"ltr"`) to a target element (defaults to `document.documentElement`).
- `LocalePicker.test.tsx` — vitest spec with one assertion per
  acceptance criterion in `spec.md §7`. Covers pure helpers, the
  markup contract, the DOM apply contract, persistence, custom
  `target`, `applyDir={false}`, `children` render prop, navigator
  detection, and rest-prop spread.
- `locales.ts` — 436-row built-in table mapping locale code →
  English name. Also exports `RTL_LANGUAGE_TAGS` and
  `RTL_SCRIPT_SUBTAGS` for the RTL detection algorithm. Byte-identical
  to the Svelte counterpart.
- `locales.tsv` — canonical 436-row source for `locales.ts`. Byte-
  identical to the Svelte counterpart.
- `index.ts` — barrel re-export of `LocalePicker`, the pure helpers
  (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`), the static data exports
  (`defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`),
  the `Props` and `ChildArgs` types, and the default export.
- `spec.md` — canonical specification mirroring the Svelte
  counterpart's contract; spec version 0.1.0.
- `index.md` — comprehensive user guide with table of contents,
  quick start, props, custom rendering, persistence, navigator
  detection, RTL, accessibility, SSR, i18n integration, recipes,
  troubleshooting.
- `AGENTS.md` — AI-coding entrypoint.
- `AGENTS/` — five topic files for AI agents:
  `api.md`, `lifecycle.md`, `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` — six topic guides for humans:
  `accessibility.md`, `bcp47.md`, `concepts.md`,
  `i18n-integration.md`, `rtl.md`, `ssr.md`.
- `examples/` — ten runnable examples plus a `README.md` index:
  `01-radios.tsx`, `02-select.tsx`, `03-buttons.tsx`,
  `04-rtl-demo.tsx`, `05-nhs-style.tsx`, `06-with-react-intl.tsx`,
  `07-with-react-i18next.tsx`, `08-ssr-cookie.tsx`,
  `09-scoped-target.tsx`, `10-combobox.tsx`.

### Parity with Svelte counterpart

This helper mirrors
`lily-design-system-svelte-helpers/lily-design-system-svelte-locale-picker`:

- Same `<fieldset role="radiogroup">` DOM contract.
- Same per-option `<label lang={tagFor(locale)}>` for WCAG 3.1.2.
- Same `lang` + `dir` apply target (default `document.documentElement`).
- Same BCP 47 hyphen-form normalisation on the wire.
- Same RTL detection algorithm (`RTL_LANGUAGE_TAGS` ∪ `RTL_SCRIPT_SUBTAGS`).
- Same initial-value resolution order (`value` > storage > navigator >
  `defaultValue` > `"en"` > `locales[0]`).
- Same `localStorage` try/catch persistence with silent error
  swallowing.
- Same `onChange(code)` callback firing after every apply, with
  consumer-form code (not BCP 47-normalised).
- Same `ChildArgs` shape passed to the render prop:
  `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.
- Same `defaultLocaleLabels` 436-row table (byte-identical
  `locales.tsv`).

### Differences from the Svelte counterpart

- `value` is a controlled prop paired with `onChange`, not a
  `$bindable()` two-way binding.
- `children` is a render prop function `(args: ChildArgs) => ReactNode`,
  not a `Snippet`.
- `className` not `class`.
- The picker carries `"use client"` for the React Server Components
  boundary.
- SSR recipe uses Next.js App Router `cookies()` + a client component
  wrapper, not SvelteKit's `transformPageChunk`.
- Hooks (`useState`, `useEffect`, `useRef`) replace runes (`$state`,
  `$effect`, `$bindable`).
- `i18n-integration.md` covers the four common React i18n stacks
  (`react-intl`, `react-i18next`, Lingui, raw `Intl.*`) rather than the
  Svelte-specific four (`svelte-i18n`, Paraglide, Tolgee, raw `Intl.*`).

### Tracking

- Package directory:
  `lily-design-system-react-helpers/lily-design-system-react-locale-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
