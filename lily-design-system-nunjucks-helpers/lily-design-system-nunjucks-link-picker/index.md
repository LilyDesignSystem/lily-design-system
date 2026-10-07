# link-picker (Nunjucks)

A headless control for **page links**: a single-icon button (a bundled home SVG) that opens a dropdown of links **your app
defines** — "Home", "About Us", "Contact Us", "Privacy Policy". No CSS, no routes, no English.

The single source of truth is [spec/index.md](./spec/index.md); this file is the guide.

## Quick start

```njk
{% from "lily-design-system-nunjucks-link-picker/dist/link-picker.njk" import linkPicker %}

{{ linkPicker({
  label: "Pages",
  links: [
    {label: "Home", href: "/", current: page.url == "/"},
    {label: "About Us", href: "/about/", current: page.url == "/about/"},
    {label: "Contact Us", href: "/contact/", current: page.url == "/contact/"},
    {label: "Privacy Policy", href: "/privacy/", current: page.url == "/privacy/"}
  ]
}) }}

<script type="module">
  import { autoInit } from "@lilydesignsystem/nunjucks-link-picker";
  autoInit();
</script>
```

`label` names the button, the list and the tooltip. There is **no default list**: the package ships no routes and no English.

## Client-side navigation

```js
import { autoInit } from "@lilydesignsystem/nunjucks-link-picker";

// A client-side router (e.g. htmx boost, Turbo, Navigo) takes over plain left clicks.
autoInit({ navigate: (href) => router.navigate(href) });
```

Ctrl/Cmd/Shift/Alt-click, middle-click and `newTab` links always stay native browser behaviour.

## `LinkItem`

| Field | Notes |
| --- | --- |
| label | Visible text. Yours, so it localises. |
| href | A route (`"/about/"`) or a full URL. |
| id | Reported when a link is chosen; defaults to the href. |
| current | Marks the current page with `aria-current="page"`. |
| newTab | `target="_blank"` with `rel="noopener noreferrer"`. |

## Props

| `label` | `string` | yes | Accessible name of the button **and** the list; also the tooltip text. |
| `links` | `array` | yes | `{ label, href, id?, current?, newTab? }`, already resolved (hrefs are strings). |
| `name` / `id` | `string` | no | Id discriminator / explicit id prefix (default `link-picker-link`). |
| `classes` / `attributes` | | no | Extra root classes / attributes. |
| `{% call %}` body | | no | Replaces the **icon**, not the links. |
| client `navigate`, `onNavigate` | functions | no | Passed to `initLinkPicker(root, opts)` / `autoInit(opts)`: a macro cannot carry a function. |

## Styling

Headless: no CSS ships. Hooks: `.link-picker`, `.link-picker-button`, `.link-picker-icon`, `.link-picker-tooltip`,
`.link-picker-list` (carries `hidden` when closed), `.link-picker-list-item`, `.link-picker-link`. The monorepo's 45 `themes/`
style them all, including the popup placement.

## Examples

[examples/](./examples/README.md): the four-link example, router integration and a custom icon.
