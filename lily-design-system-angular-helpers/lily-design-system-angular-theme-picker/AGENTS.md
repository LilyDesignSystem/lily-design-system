# AGENTS — ThemePicker (Angular helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless theme picker that **loads theme CSS
files dynamically at runtime** from a developer-supplied directory
URL. Ships no CSS; consumer styles the `theme-picker` class hook.

## Files

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `spec.md`                         | Specification-driven contract (canonical).       |
| `theme-picker.component.ts`       | Implementation. Standalone, signal-based, OnPush.|
| `theme-picker.component.spec.ts`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                        | Barrel re-export.                                |
| `index.md`                        | User guide.                                      |

## Public surface

- `ThemePicker` (component class, selector `lily-theme-picker`).
- `normaliseThemesUrl`, `themeHref` (pure helpers).

Required inputs: `label`, `themesUrl`, `themes`. Full table in
[spec.md §4.1](./spec.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every theme change the picker (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-picker="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) emits `themeChange(slug)`.
SSR-safe — all DOM writes guard on `typeof document`. Initial value
resolves from `value` > storage > `defaultValue` > `"light"` (if
present) > `themes[0]`.

## HTML

`<fieldset class="theme-picker {className}" role="radiogroup"
[attr.aria-label]="label">` with one native `<input type="radio">`
per slug. `@for` is used (not `*ngFor`).

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()`, `model<string>()`, `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow (not `*ngFor`).
- Template-cast: `$any($event.target).value` (not the parenthesised
  TS-cast form).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs.
