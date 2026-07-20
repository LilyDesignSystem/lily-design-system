# AGENTS — ThemeSelect (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless theme select that **loads theme CSS
files dynamically at runtime** from a developer-supplied directory
URL. Ships no CSS; consumer styles the `theme-select` class hook.

## Files

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `spec/index.md`                         | Specification-driven contract (canonical).       |
| `theme-select.component.ts`       | Implementation. Standalone, signal-based, OnPush.|
| `theme-select.component.spec.ts`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                        | Barrel re-export.                                |
| `index.md`                        | User guide.                                      |

## Public surface

- `ThemeSelect` (component class, selector `lily-theme-select`).
- `normaliseThemesUrl`, `themeHref` (pure helpers).

Required inputs: `label`, `themesUrl`, `themes`. Optional
`placeholder` overrides the placeholder-option text (defaults to
`label`). Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-select="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) emits `themeChange(slug)`.
SSR-safe — all DOM writes guard on `typeof document`. Initial value
resolves from `value` > storage > `defaultValue` > `"light"` (if
present) > `themes[0]`.

**The `<select>` is not bound to `value`.** Its own selection stays
pinned to the leading placeholder option so the closed control always
reads the placeholder word and stays that narrow. On change,
`onSelectChange(event)` reads the chosen slug, resets `el.value = ""`,
and writes to the `value` model signal. No real option carries a
`[selected]` binding. The event is not stopped, so a consumer binding
`(change)` on the host still receives it — `change` bubbles.

## HTML

`<select class="theme-select {className}" [attr.aria-label]="label"
[name]="name">` with a leading `<option class="theme-select-option
theme-select-placeholder" value="" selected>{{ placeholder() ||
label() }}</option>` followed by one native
`<option class="theme-select-option">` per slug. `@for` is used (not
`*ngFor`).

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
