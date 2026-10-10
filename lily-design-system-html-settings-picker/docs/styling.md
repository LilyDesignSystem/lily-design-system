# Styling — `<settings-picker>`

The package ships no CSS, including the panel's positioning; the monorepo's `themes/` do it for you.

| Hook | Element |
| ---- | ------- |
| `.settings-picker` | Rendered root `<div>`. Your `class` attribute is appended. |
| `.settings-picker-button` | The trigger `<button>`. |
| `.settings-picker-icon` | The `aria-hidden` SVG. |
| `.settings-picker-tooltip` | The `role="tooltip"` hint. Carries `hidden` when not shown. |
| `.settings-picker-panel` | The `role="group"` panel holding your content. Carries `hidden` when closed. |

Minimum CSS: `.settings-picker { position: relative; display: inline-block }`, `.settings-picker-panel { position: absolute }` and
`.settings-picker-panel[hidden], .settings-picker-tooltip[hidden] { display: none }` (the `hidden` rule is the one people forget).
A panel near the right edge of the window should be placed with CSS anchor positioning and a flip fallback, as the themes do.
