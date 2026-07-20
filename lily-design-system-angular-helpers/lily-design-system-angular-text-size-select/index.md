# TextSizeSelect (Angular helper)

A reusable Angular 20 headless **text-size select**. Renders an icon
button that opens a [WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
of text-size slugs and, on every change, sets
`data-text-size="{slug}"` on a target element (default
`document.documentElement`), optionally persisting the choice to
`localStorage`. Same shape as the sibling `theme-select` and
`locale-select` helpers. Ships no CSS — the consumer supplies the
listbox positioning and maps each size slug to real typography, e.g.:

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
| `label`        | `string`                       | yes      | Accessible name (`aria-label`) for the button and listbox. |
| `sizes`        | `string[]`                     | yes      | Available size slugs.                                  |
| `value`        | `string`                       | no       | Selected slug. Two-way bindable via `[(value)]`.       |
| `defaultValue` | `string`                       | no       | Initial slug when nothing else is supplied.            |
| `storageKey`   | `string`                       | no       | If set, persist the slug to `localStorage`.            |
| `name`         | `string`                       | no       | `name` of the hidden input (default `"text-size"`).    |
| `target`       | `HTMLElement \| null`          | no       | Element to receive `data-text-size`. Default `<html>`. |
| `sizeLabels`   | `Record<string,string>`        | no       | Pretty labels per slug.                                |
| `className`    | `string`                       | no       | Extra CSS class on the root `<div>`.                   |
| `sizeChange`   | `output<string>`               | no       | Emits after a new size is applied.                     |

## Markup

```html
<div class="text-size-select">
  <input type="hidden" name="text-size" value="medium" />
  <button type="button" class="text-size-select-button" aria-label="Text size"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="…-list">
    <span class="text-size-select-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-select-list" id="…-list" role="listbox"
      aria-label="Text size" tabindex="-1" hidden>
    <li class="text-size-select-option" role="option" aria-selected="true"
        data-active>Medium</li>
  </ul>
</div>
```

The glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A) — a plain letter
rather than a pictograph, so it renders in the page's own font on
every platform. `data-active` marks the keyboard cursor;
`aria-selected` marks the size in effect. Style both, differently.

## Custom glyph

Project an `<ng-template>` to replace the glyph inside the button. It
receives `{ value, open, labelFor }`; it does **not** render options.

```html
<lily-text-size-select label="Text size" [sizes]="sizes">
  <ng-template lilyTextSizeSelectIcon let-args>
    <svg width="16" height="16" aria-hidden="true" focusable="false">…</svg>
  </ng-template>
</lily-text-size-select>
```

## Behaviour

Initial value resolves from `value` > storage > `defaultValue` >
`"medium"` (if present) > `sizes[0]`. All DOM writes happen inside an
`effect()` guarded on `typeof document`, so the component is SSR-safe.

`labelFor(slug)` returns `sizeLabels[slug]` if present, else delegates
to the exported `sizeName(slug)`, which title-cases the slug per
hyphen-word (`x-large` → `X Large`).

There is no OS-preference detection: unlike `prefers-color-scheme`
for themes or `navigator.languages` for locales, no "preferred text
size" media query exists.

## Keyboard

`ArrowDown` / `Enter` / `Space` open the listbox on the selected
option; `ArrowUp` opens on the last. Inside the listbox: arrows move
the cursor and clamp (no wrap), `Home` / `End` jump, printable
characters typeahead over the labels with a 500 ms buffer, `Enter` /
`Space` select and return focus to the button, `Escape` closes
unchanged, `Tab` closes and moves on. Clicking an option selects it;
clicking outside closes.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) and
  1.4.12 (Text Spacing).
- The button is icon-only, so `aria-label` is its **entire**
  accessible name. Name the setting ("Text size"), not the widget.
- This is a hand-rolled listbox, not a native `<select>` — it has
  weaker assistive-technology support. See
  [docs/accessibility.md](./docs/accessibility.md) for the full
  tradeoffs.
- Default labels title-case the slug.

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()`, `model<string>()`, `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs.

## License

Dual-licensed under MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or
BSD-3-Clause. Contact joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
