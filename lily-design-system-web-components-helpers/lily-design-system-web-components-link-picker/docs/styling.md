# Styling — `<lily-link-picker>`

The package ships no CSS, including the list's positioning; the monorepo's `themes/` do it for you.

| Hook | Element |
| ---- | ------- |
| `.link-picker` | Rendered root `<div>`. Your `class` attribute is appended. |
| `.link-picker-button` | The trigger `<button>`. |
| `.link-picker-icon` | The `aria-hidden` SVG. |
| `.link-picker-tooltip` | The `role="tooltip"` hint. Carries `hidden` when not shown. |
| `.link-picker-list` | The `<ul>`. Carries `hidden` when closed. |
| `.link-picker-list-item` | Each `<li>`. |
| `.link-picker-link` | Each `<a>`. `[aria-current="page"]` marks the current page. |

Minimum CSS: `.link-picker { position: relative; display: inline-block }`, `.link-picker-list { position: absolute }` and
`.link-picker-list[hidden], .link-picker-tooltip[hidden] { display: none }` (the `hidden` rule is the one people forget).
A list near the right edge of the window should be placed with CSS anchor positioning and a flip fallback, as the themes do.
