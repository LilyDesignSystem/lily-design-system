# SettingsPicker (Angular helper)

A headless Angular control for **a dropdown of whatever your app provides**: a single-icon button (a bundled
cog SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```ts
import { SettingsPicker, SettingsPickerIcon } from "@lilydesignsystem/angular-settings-picker";
```

## Quick start

```ts
@Component({
  standalone: true,
  imports: [SettingsPicker],
  template: `
    <lily-settings-picker label="Settings">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><button type="button" (click)="signOut()">Sign out</button></li>
      </ul>
    </lily-settings-picker>
  `,
})
export class Header {}
```

`label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours.

## Closing from your content

Give the element a template reference to its `exportAs`:

```html
<lily-settings-picker #menu="lilySettingsPicker" label="Settings">
  <form (submit)="$event.preventDefault(); search(); menu.close()">
    <input type="search" aria-label="Search" />
  </form>
</lily-settings-picker>
```

By default, activating a link, a button or a `[role="menuitem"]` inside the panel closes it. Turn that off with
`[closeOnSelect]="false"`, or opt one element or region out with a `data-settings-picker-keep-open` ancestor.

## Inputs and outputs

`label` (required), `[(open)]`, `closeOnSelect` (default `true`), `className`; projected content is the panel, and a projected
`<ng-template lilySettingsPickerIcon let-args>` replaces the **icon**, not the content.

## Styling

Headless: no CSS ships. Target `.settings-picker`, `.settings-picker-button`, `.settings-picker-icon`, `.settings-picker-tooltip`,
`.settings-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, a panel with a form and `close`, and a custom icon.
