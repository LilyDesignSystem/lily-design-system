# MenuPicker (Nunjucks helper)

A headless Nunjucks macro for **a dropdown of whatever your app provides**: a single-icon button (a bundled
three-line hamburger SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```njk
{% from "@lilydesignsystem/nunjucks-menu-picker/template" import menuPicker %}
```

```js
import { autoInit } from "@lilydesignsystem/nunjucks-menu-picker"; // client runtime
```

## Quick start

```njk
{% call menuPicker({ label: "Menu" }) %}
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About Us</a></li>
    <li><button type="button">Sign out</button></li>
  </ul>
{% endcall %}
```

```js
autoInit();
```

`label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours. The `{% call %}` body is the panel's
content and is server-rendered ([docs/ssr.md](./docs/ssr.md)).

## Closing from your content

`initMenuPicker(root, opts)` and `autoInit(opts)` return `{ open, close, destroy }`; keep the handle to close the panel from
your own code. By default, activating a link, a button or a `[role="menuitem"]` inside the panel closes it. Turn that off with
`autoInit({ closeOnSelect: false })`, or opt one element or region out with a `data-menu-picker-keep-open` ancestor.

## Options

Macro `opts`: `label` (required), `open`, `iconHtml` (trusted HTML replacing the **icon**, not the content), `name`, `id`,
`classes`, `attributes`. Client options: `closeOnSelect` (default `true`), `onOpenChange`.

## Styling

Headless: no CSS ships. Target `.menu-picker`, `.menu-picker-button`, `.menu-picker-icon`, `.menu-picker-tooltip`,
`.menu-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, the client wiring, and a custom icon.
