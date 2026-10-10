# `<settings-picker>` (HTML helper)

A headless custom element for **a dropdown of whatever your app provides**: a single-icon button (a bundled
cog SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```ts
import "@lilydesignsystem/html-settings-picker"; // registers <settings-picker>
```

## Quick start

```html
<settings-picker label="Settings">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About Us</a></li>
    <li><button type="button">Sign out</button></li>
  </ul>
</settings-picker>
```

`label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours. The element's own children become the
panel's content (they are moved into it when the element first connects).

## Closing from your content

`menu.close()` closes the panel and returns focus to the button; the `openchange` event reports every change:

```js
const menu = document.querySelector("settings-picker");
document.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); menu.close(); });
menu.addEventListener("openchange", (e) => console.log(e.detail.open));
```

By default, activating a link, a button or a `[role="menuitem"]` inside the panel closes it. Turn that off with
`close-on-select="false"`, or opt one element or region out with a `data-settings-picker-keep-open` ancestor.

## Attributes, properties, events

`label` (required), `open` (reflected boolean), `close-on-select`, `class`; methods `openPanel()`, `closePanel()`, `close()`;
event `openchange` (`detail.open`). Subclass and override `renderButtonContent()` to replace the **icon**, not the content.

## Styling

Headless: no CSS ships. Target `.settings-picker`, `.settings-picker-button`, `.settings-picker-icon`, `.settings-picker-tooltip`,
`.settings-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, and a form with `close()` and `openchange`.
