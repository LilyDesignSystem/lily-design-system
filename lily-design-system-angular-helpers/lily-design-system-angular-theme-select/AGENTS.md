# AGENTS — ThemeSelect (Angular helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless theme picker that **loads theme CSS
files dynamically at runtime** from a developer-supplied directory
URL. Ships no CSS; consumer styles the `theme-select` class hook.

## Files

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `spec.md`                         | Specification-driven contract (canonical).       |
| `theme-select.component.ts`       | Implementation. Standalone, signal-based, OnPush.|
| `theme-select.component.spec.ts`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                        | Barrel re-export.                                |
| `index.md`                        | User guide.                                      |

## Public surface

- `ThemeSelect` (component class, selector `lily-theme-select`).
- `normaliseThemesUrl`, `themeHref` (pure helpers).

Required inputs: `label`, `themesUrl`, `themes`. Full table in
[spec.md §4.1](./spec.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every theme change the picker (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-select="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) emits `themeChange(slug)`.
SSR-safe — all DOM writes guard on `typeof document`. Initial value
resolves from `value` > storage > `defaultValue` > `"light"` (if
present) > `themes[0]`.

## HTML

`<select class="theme-select {className}" [attr.aria-label]="label"
[name]="name">` with one native `<option class="theme-select-option">`
per slug. `@for` is used (not `*ngFor`).

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead
  semantics.
- `aria-label` carries the consumer-supplied accessible name.
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
