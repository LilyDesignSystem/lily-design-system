# AGENTS — TextSizeSelect (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless text-size select. Applies the chosen
size to the document root via `data-text-size`, with optional
`localStorage` persistence. Ships no CSS; consumer styles the
`text-size-select` class hook and maps each `[data-text-size="…"]`
slug to real typography.

## Files

| File                                   | Purpose                                          |
| -------------------------------------- | ------------------------------------------------ |
| `spec/index.md`                              | Specification-driven contract (canonical).       |
| `text-size-select.component.ts`        | Implementation. Standalone, signal-based, OnPush.|
| `text-size-select.component.spec.ts`   | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                             | Barrel re-export.                                |
| `index.md`                             | User guide.                                      |

## Public surface

- `TextSizeSelect` (component class, selector `lily-text-size-select`).

Required inputs: `label`, `sizes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every size change the select (1) sets
`data-text-size="{slug}"` on `target` (defaults to
`document.documentElement`), (2) optionally writes the slug to
`localStorage[storageKey]`, and (3) emits `sizeChange(slug)`. SSR-safe
— all DOM writes guard on `typeof document`. Initial value resolves
from `value` > storage > `defaultValue` > `"medium"` (if present) >
`sizes[0]`.

## HTML

`<select class="text-size-select {className}"
[attr.aria-label]="label" [name]="name">` with one native
`<option class="text-size-select-option">` per slug. `@for` is used
(not `*ngFor`).

## Accessibility

- WCAG 2.2 AAA target; supports 1.4.4 (Resize Text) and 1.4.12 (Text
  Spacing).
- The native `<select>` provides Arrow / Home / End / typeahead
  semantics.
- `aria-label` carries the consumer-supplied accessible name on the
  `<select>` (implicit `combobox` role).

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
