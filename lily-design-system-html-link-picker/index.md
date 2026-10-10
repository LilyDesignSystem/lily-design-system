# `<link-picker>` (HTML helper)

A custom element for **page links**: a single-icon button (a bundled home SVG) that opens a dropdown of links **your app
defines** — "Home", "About Us", "Contact Us", "Privacy Policy". Light DOM, no framework, no CSS.

The single source of truth is [spec/index.md](./spec/index.md); this file is the guide.

## Quick start

```html
<link-picker
  label="Pages"
  links='[
    {"label":"Home","href":"/"},
    {"label":"About Us","href":"/about/"},
    {"label":"Contact Us","href":"/contact/"},
    {"label":"Privacy Policy","href":"/privacy/"}
  ]'
></link-picker>

<script type="module">
  import "@lilydesignsystem/html-link-picker";
</script>
```

Or set `links` as a property: `document.querySelector("link-picker").links = [...]`. `label` names the button, the list and
the tooltip. There is **no default list**: the package ships no routes and no English.

## Client-side routing

```js
picker.addEventListener("navigate", (event) => {
  event.preventDefault();               // only possible for a plain left click
  router.go(event.detail.href);         // detail: { id, href }
});
```

Modified clicks (Ctrl/Cmd/Shift/Alt, middle button) and `newTab` links are never offered for interception.

## `LinkItem`

| Field | Notes |
| --- | --- |
| `label` | Visible text. Yours, so it localises. |
| `href` | A route (`"/about/"`) or a full URL. |
| `id` | Reported by `navigate` / `onNavigate`; defaults to `href`. |
| `current` | Marks the current page with `aria-current="page"`. |
| `newTab` | `target="_blank"` with `rel="noopener noreferrer"`. |

## Styling

No CSS ships. Hooks: `.link-picker`, `.link-picker-button`, `.link-picker-icon`, `.link-picker-tooltip`, `.link-picker-list`
(carries `hidden` when closed), `.link-picker-list-item`, `.link-picker-link`. The monorepo's 45 `themes/` style them all.
See [docs/styling.md](./docs/styling.md).

## Examples

[examples/](./examples/README.md): the four-link example, and one wiring the `navigate` event.
