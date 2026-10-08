# Styling — `<menu-picker>`

The package ships no CSS, including the panel's positioning; the monorepo's `themes/` do it for you.

| Hook | Element |
| ---- | ------- |
| `.menu-picker` | Rendered root `<div>`. Your `class` attribute is appended. |
| `.menu-picker-button` | The trigger `<button>`. |
| `.menu-picker-icon` | The `aria-hidden` SVG. |
| `.menu-picker-tooltip` | The `role="tooltip"` hint. Carries `hidden` when not shown. |
| `.menu-picker-panel` | The `role="group"` panel holding your content. Carries `hidden` when closed. |

Minimum CSS: `.menu-picker { position: relative; display: inline-block }`, `.menu-picker-panel { position: absolute }` and
`.menu-picker-panel[hidden], .menu-picker-tooltip[hidden] { display: none }` (the `hidden` rule is the one people forget).
A panel near the right edge of the window should be placed with CSS anchor positioning and a flip fallback, as the themes do.
