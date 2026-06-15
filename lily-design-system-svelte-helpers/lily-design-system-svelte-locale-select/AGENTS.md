# AGENTS — LocaleSelect (Svelte helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless locale picker that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-select` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `LocaleSelect.svelte`      | Implementation. Svelte 5 runes + TypeScript.     |
| `LocaleSelect.test.ts`     | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Human-readable guide.                            |
| `docs/`                    | Topic guides: a11y, BCP 47, concepts, i18n, RTL, SSR. |
| `examples/`                | Ten self-contained Svelte 5 examples.            |

## Public surface

- Default export: `LocaleSelect` component.
- Named exports: `LocaleSelect`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `locales`. Full table in
[spec.md §4.1](./spec.md#41-props).

## Behaviour contract (one paragraph)

On every locale change the picker (1) sets `target.lang` to the
BCP 47 hyphen form of the code, (2) sets `target.dir` to `"rtl"` /
`"ltr"` (skipped if `applyDir=false`), (3) optionally writes to
`localStorage[storageKey]`, and (4) calls `onChange(code)` with the
consumer-form code. SSR-safe — all DOM writes happen inside
`$effect`. Initial value resolves from `value` > storage > navigator
detection (if enabled) > `defaultValue` > `"en"` (if present) >
`locales[0]`.

## HTML

`<fieldset class="locale-select {class}" role="radiogroup"
aria-label="{label}">` with one native `<input type="radio">` per
locale code. Each option is wrapped in a `<label lang="{tagFor(…)}">`
so its name is pronounced in its own language. Custom rendering via
the `children` snippet receiving
`{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.

## Accessibility

- WCAG 2.2 AAA target. WCAG 3.1.1 (Language of Page) and 3.1.2
  (Language of Parts).
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$effect`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
