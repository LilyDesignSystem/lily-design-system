# AGENTS — LocaleSelect (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless locale select. Applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-select` class hook.

## Files

| File                                | Purpose                                          |
| ----------------------------------- | ------------------------------------------------ |
| `spec/index.md`                           | Specification-driven contract (canonical).       |
| `locale-select.component.ts`        | Implementation. Standalone, signal-based, OnPush.|
| `locale-select.component.spec.ts`   | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`                        | Code → English-name map and RTL sets.            |
| `locales.tsv`                       | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                          | Barrel re-export.                                |
| `index.md`                          | User guide.                                      |

## Public surface

- `LocaleSelect` (component class, selector `lily-locale-select`).
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers).
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (constants).

Required inputs: `label`, `locales`. Optional `placeholder` overrides
the placeholder-option text (defaults to `label`). Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every locale change the select (1) sets
`target.lang = bcp47LocaleTag(code)`, (2) optionally sets
`target.dir = isRtlLocale(code) ? "rtl" : "ltr"`, (3) optionally
writes `code` to `localStorage[storageKey]`, and (4) emits
`localeChange(code)` with the consumer-form code. SSR-safe — all DOM
writes guard on `typeof document`. Initial value resolves from
`value` > storage > navigator (if `detectFromNavigator`) >
`defaultValue` > `"en"` (if present) > `locales[0]`.

**The `<select>` is not bound to `value`.** Its own selection stays
pinned to the leading placeholder option so the closed control always
reads the placeholder word and stays that narrow. On change,
`onSelectChange(event)` reads the chosen code, resets `el.value = ""`,
and writes to the `value` model signal. No real option carries a
`[selected]` binding. The event is not stopped, so a consumer binding
`(change)` on the host still receives it — `change` bubbles.

## HTML

`<select class="locale-select {className}"
[attr.aria-label]="label" [name]="name">` with a leading
`<option class="locale-select-option locale-select-placeholder"
value="" selected>{{ placeholder() || label() }}</option>` followed by
one native `<option>` per locale code, each carrying its own `lang`
attribute so its name is pronounced in its own language. The
placeholder is not a locale and carries no `lang`. `@for` is used (not
`*ngFor`).

## Accessibility

- WCAG 2.2 AAA target. WCAG 3.1.1 (Language of Page) and 3.1.2
  (Language of Parts).
- The native `<select>` provides Arrow / Home / End / typeahead
  semantics.
- `aria-label` carries the consumer-supplied accessible name on the
  `<select>` (implicit `combobox` role).
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
