# AGENTS — LocalePicker (Angular helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless locale picker. Applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-picker` class hook.

## Files

| File                                | Purpose                                          |
| ----------------------------------- | ------------------------------------------------ |
| `spec.md`                           | Specification-driven contract (canonical).       |
| `locale-picker.component.ts`        | Implementation. Standalone, signal-based, OnPush.|
| `locale-picker.component.spec.ts`   | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`                        | Code → English-name map and RTL sets.            |
| `locales.tsv`                       | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                          | Barrel re-export.                                |
| `index.md`                          | User guide.                                      |

## Public surface

- `LocalePicker` (component class, selector `lily-locale-picker`).
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers).
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (constants).

Required inputs: `label`, `locales`. Full table in
[spec.md §4.1](./spec.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every locale change the picker (1) sets
`target.lang = bcp47LocaleTag(code)`, (2) optionally sets
`target.dir = isRtlLocale(code) ? "rtl" : "ltr"`, (3) optionally
writes `code` to `localStorage[storageKey]`, and (4) emits
`localeChange(code)` with the consumer-form code. SSR-safe — all DOM
writes guard on `typeof document`. Initial value resolves from
`value` > storage > navigator (if `detectFromNavigator`) >
`defaultValue` > `"en"` (if present) > `locales[0]`.

## HTML

`<fieldset class="locale-picker {className}" role="radiogroup"
[attr.aria-label]="label">` with one native `<input type="radio">`
per locale, each wrapped in a `<label>` carrying its own `lang`
attribute. `@for` is used (not `*ngFor`).

## Accessibility

- WCAG 2.2 AAA target. WCAG 3.1.1 (Language of Page) and 3.1.2
  (Language of Parts).
- Native radio inputs provide Arrow / Space / Tab semantics.
- Each option carries `lang` so assistive tech switches pronunciation.

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()`, `model<string>()`, `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow.
- Template-cast: `$any($event.target).value`.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs.
