# TabPanel

a content panel associated with a tab in a tab bar

## Description

TabPanel renders a `<div role="tabpanel">` to host the content for
one tab in a `TabBar`. The panel is focusable via `tabindex="0"`.
When `selected` is true, the panel is visible; otherwise it
renders the `hidden` attribute.

When `labelledBy` is provided, the panel is named via
`aria-labelledby` pointing at the controlling tab button, and
`aria-label` is omitted. Otherwise `aria-label` (from `label`) is
used.

## HTML tag

`<div role="tabpanel">`

## CSS class

`tab-panel`

## Params

- `label` — string. **Required when `labelledBy` is not provided.**
  `aria-label` for the panel.
- `labelledBy` — string. Optional id of the tab button that
  controls this panel. When provided, `aria-labelledby` is rendered
  and `aria-label` is omitted.
- `selected` — boolean. Default `false`. Whether the panel is the
  currently selected one. When false the `hidden` attribute is
  added.
- `id` — string.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

Paired with a `TabBar` and `TabBarButton`:

```njk
{% from "components/tab-bar/macro.njk" import tabBar %}
{% from "components/tab-bar-button/macro.njk" import tabBarButton %}
{% from "components/tab-panel/macro.njk" import tabPanel %}

{% call tabBar({ label: "Sections" }) %}
  {{ tabBarButton({ id: "tab-1", text: "One",  selected: true }) }}
  {{ tabBarButton({ id: "tab-2", text: "Two",  selected: false }) }}
{% endcall %}

{{ tabPanel({
  id: "panel-1",
  labelledBy: "tab-1",
  selected: true,
  html: "<p>Panel one content.</p>"
}) }}

{{ tabPanel({
  id: "panel-2",
  labelledBy: "tab-2",
  selected: false,
  html: "<p>Panel two content.</p>"
}) }}
```

## Accessibility

- `role="tabpanel"`.
- `aria-labelledby` (when `labelledBy` is supplied) names the panel
  by pointing at the controlling tab button.
- `aria-label` (otherwise) supplies an explicit accessible name.
- `tabindex="0"` so keyboard users can focus the panel.
- `hidden` is rendered when `selected` is false.

## Headless

No CSS or JavaScript bundled. The consumer wires up the
selected-tab logic and styling.

## Testing

`components/tab-panel/macro.test.js` verifies the role,
aria-label / aria-labelledby switching, `tabindex`, the `hidden`
toggle, content slots, classes, and attributes.

## References

- [WAI-ARIA: tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Adobe Spectrum: Tabs](https://spectrum.adobe.com/page/tabs/)

---

Lily™ and Lily Design System™ are trademarks.
