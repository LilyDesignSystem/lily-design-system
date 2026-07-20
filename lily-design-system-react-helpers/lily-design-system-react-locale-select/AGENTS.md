# AGENTS — LocaleSelect (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless locale select that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-select` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `LocaleSelect.tsx`         | Implementation. TypeScript + React 19 hooks.    |
| `LocaleSelect.test.tsx`    | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in locale-code → English-name table.       |
| `locales.tsv`              | Canonical 436-row locale list.                   |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |

## Public surface

- Default export: `LocaleSelect` component.
- Named exports: `LocaleSelect`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `locales`. Optional `placeholder` overrides
the placeholder-option text (defaults to `label`). Full table in
[spec/index.md §4.1](./spec/index.md#41-props).

## Behaviour contract (one paragraph)

On every locale change the select (1) sets `target.lang` to the BCP 47
hyphen form of the locale code, (2) sets `target.dir` to `"rtl"` or
`"ltr"` (skipped when `applyDir` is false), (3) optionally writes the
code to `localStorage[storageKey]`, and (4) calls `onChange(code)`.
SSR-safe — all DOM writes happen inside `useEffect`. Initial value
resolves from `value` > storage > navigator (if `detectFromNavigator`)
> `defaultValue` > `"en"` (if present) > `locales[0]`. The `<select>`'s
own DOM value is pinned to `""` and snaps back to the placeholder
option after every change, so the closed control always reads
`placeholder ?? label` rather than the active locale; the real
selection lives in `value` / internal state and everything downstream
is unchanged.

## HTML

`<select className="locale-select {className}" aria-label="{label}" name="{name}" value="">`
whose first child is always the component-owned placeholder
`<option className="locale-select-option locale-select-placeholder" value="">{placeholder ?? label}</option>`
(no `lang` — it is not a locale), followed by one native
`<option className="locale-select-option">` per locale, each carrying
`lang="{tagFor(locale)}"` for WCAG 3.1.2 (Language of Parts). Custom
rendering via the `children` render prop receiving
`{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`; the
output is rendered inside the `<select>`, after the placeholder.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead semantics.
- `aria-label` carries the consumer-supplied accessible name on the
  `<select>` (implicit `combobox` role).
- Each option carries its locale via `lang` so screen readers
  pronounce option text in the right voice.
- The document root gets `lang` and (by default) `dir`.

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
