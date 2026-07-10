# TextSizeSelect (Angular helper)

A reusable Angular 20 headless **text-size select**. Renders a native
`<select>` of text-size slugs and, on every change, sets
`data-text-size="{slug}"` on a target element (default
`document.documentElement`), optionally persisting the choice to
`localStorage`. Ships no CSS — the consumer maps each size slug to
real typography via CSS, e.g.:

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }
```

This supports WCAG 2.2 — 1.4.4 (Resize Text) and 1.4.12 (Text
Spacing) — by letting users pick a comfortable reading size that the
app remembers.

## Usage

```ts
import { Component, signal } from "@angular/core";
import { TextSizeSelect } from "lily-design-system-angular-text-size-select";

@Component({
  standalone: true,
  imports: [TextSizeSelect],
  template: `
    <lily-text-size-select
      label="Text size"
      [sizes]="['small', 'medium', 'large', 'x-large']"
      [(value)]="size"
      storageKey="lily-text-size"
    />
  `,
})
export class SettingsPage {
  size = signal("");
}
```

## Inputs / outputs

| Input / output | Type                           | Required | Description                                            |
| -------------- | ------------------------------ | -------- | ------------------------------------------------------ |
| `label`        | `string`                       | yes      | Accessible name (`aria-label`) for the `<select>`.     |
| `sizes`        | `string[]`                     | yes      | Available size slugs.                                  |
| `value`        | `string`                       | no       | Selected slug. Two-way bindable via `[(value)]`.       |
| `defaultValue` | `string`                       | no       | Initial slug when nothing else is supplied.            |
| `storageKey`   | `string`                       | no       | If set, persist the slug to `localStorage`.            |
| `name`         | `string`                       | no       | `name` of the `<select>` (default `"text-size"`).      |
| `target`       | `HTMLElement \| null`          | no       | Element to receive `data-text-size`. Default `<html>`. |
| `sizeLabels`   | `Record<string,string>`        | no       | Pretty labels per slug.                                |
| `className`    | `string`                       | no       | Extra CSS class on the root `<select>`.                |
| `sizeChange`   | `output<string>`               | no       | Emits after a new size is applied.                     |

## Behaviour

Initial value resolves from `value` > storage > `defaultValue` >
`"medium"` (if present) > `sizes[0]`. All DOM writes happen inside an
`effect()` guarded on `typeof document`, so the component is SSR-safe.

`labelFor(slug)` returns `sizeLabels[slug]` if present, else the slug
title-cased per hyphen-word (`x-large` → `X Large`).

## Accessibility

- WCAG 2.2 AAA target; supports 1.4.4 (Resize Text).
- Native `<select>` provides Arrow / Home / End / typeahead semantics.
- `aria-label` carries the consumer-supplied accessible name.
- Default labels title-case the slug.

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

## License

Dual-licensed under MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or
BSD-3-Clause. Contact joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
