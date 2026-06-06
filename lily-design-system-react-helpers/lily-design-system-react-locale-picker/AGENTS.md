# AGENTS — LocalePicker (React helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless locale picker that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-picker` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `LocalePicker.tsx`         | Implementation. TypeScript + React 19 hooks.    |
| `LocalePicker.test.tsx`    | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in locale-code → English-name table.       |
| `locales.tsv`              | Canonical 436-row locale list.                   |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |

## Public surface

- Default export: `LocalePicker` component.
- Named exports: `LocalePicker`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `locales`. Full table in
[spec.md §4.1](./spec.md#41-props).

## Behaviour contract (one paragraph)

On every locale change the picker (1) sets `target.lang` to the BCP 47
hyphen form of the locale code, (2) sets `target.dir` to `"rtl"` or
`"ltr"` (skipped when `applyDir` is false), (3) optionally writes the
code to `localStorage[storageKey]`, and (4) calls `onChange(code)`.
SSR-safe — all DOM writes happen inside `useEffect`. Initial value
resolves from `value` > storage > navigator (if `detectFromNavigator`)
> `defaultValue` > `"en"` (if present) > `locales[0]`.

## HTML

`<fieldset className="locale-picker {className}" role="radiogroup" aria-label="{label}">`
with one native `<input type="radio">` per locale, each option wrapper
carrying `lang="{tagFor(locale)}"` for WCAG 3.1.2 (Language of Parts).
Custom rendering via the `children` render prop receiving
`{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.
- Each option carries its locale via `lang` so screen readers
  pronounce option text in the right voice.
- The document root gets `lang` and (by default) `dir`.

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
