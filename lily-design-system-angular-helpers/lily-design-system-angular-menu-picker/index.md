# MenuPicker (Angular helper)

A headless Angular control for **a dropdown of whatever your app provides**: a single-icon button (a bundled
three-line hamburger SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```ts
import { MenuPicker, MenuPickerIcon } from "@lilydesignsystem/angular-menu-picker";
```

## Quick start

```ts
@Component({
  standalone: true,
  imports: [MenuPicker],
  template: `
    <lily-menu-picker label="Menu">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><button type="button" (click)="signOut()">Sign out</button></li>
      </ul>
    </lily-menu-picker>
  `,
})
export class Header {}
```

`label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours.

## Closing from your content

Give the element a template reference to its `exportAs`:

```html
<lily-menu-picker #menu="lilyMenuPicker" label="Menu">
  <form (submit)="$event.preventDefault(); search(); menu.close()">
    <input type="search" aria-label="Search" />
  </form>
</lily-menu-picker>
```

By default, activating a link, a button or a `[role="menuitem"]` inside the panel closes it. Turn that off with
`[closeOnSelect]="false"`, or opt one element or region out with a `data-menu-picker-keep-open` ancestor.

## Inputs and outputs

`label` (required), `[(open)]`, `closeOnSelect` (default `true`), `className`; projected content is the panel, and a projected
`<ng-template lilyMenuPickerIcon let-args>` replaces the **icon**, not the content.

## Styling

Headless: no CSS ships. Target `.menu-picker`, `.menu-picker-button`, `.menu-picker-icon`, `.menu-picker-tooltip`,
`.menu-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, a panel with a form and `close`, and a custom icon.
