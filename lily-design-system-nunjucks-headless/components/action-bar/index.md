# ActionBar

a contextual action bar that appears when items are selected,
showing the selection count and bulk action buttons

## Description

ActionBar is a `<div>` with `role="toolbar"` that surfaces bulk
actions for the currently selected items. The component renders a
selection count, the consumer-supplied action buttons, and an
optional clear-selection button.

The selection count value is exposed as `data-selected-count` for
consumer styling and behaviour. The pre-formatted, locale-aware
display string is supplied separately as `selectedCountLabel` and
appears inside `<span class="action-bar-count">`.

A clear-selection button is rendered only when
`clearSelectionLabel` is provided.

## HTML tag

`<div role="toolbar">`

## CSS class

`action-bar`

## Params

- `label` — string. **Required.** `aria-label` for the toolbar.
- `selectedCount` — number. **Required.** Count of currently
  selected items, rendered as `data-selected-count`.
- `selectedCountLabel` — string. **Required.** Pre-formatted display
  of the count (e.g. `"3 selected"`). Consumer formats per locale.
- `clearSelectionLabel` — string. Optional accessible label for the
  clear-selection button. When provided, a clear button is rendered.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`),
  typically contains `ActionBarButton` elements.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/action-bar/macro.njk" import actionBar %}
{% from "components/action-bar-button/macro.njk" import actionBarButton %}

{{ actionBar({
  label: "Selection actions",
  selectedCount: 3,
  selectedCountLabel: "3 selected",
  clearSelectionLabel: "Clear selection",
  html: actionBarButton({ label: "Delete", text: "Delete" })
       + actionBarButton({ label: "Archive", text: "Archive" })
}) }}
```

## Accessibility

- `role="toolbar"` on the container.
- `aria-label` is required to name the toolbar.
- The clear-selection button has its own `aria-label`.
- The selection count text inside `<span class="action-bar-count">`
  is part of the natural reading order.

## Headless

No CSS or JavaScript is bundled. The consumer wires up click
handlers and styling.

## Testing

`components/action-bar/macro.test.js` verifies the base class,
`role="toolbar"`, the selection count rendering, the conditional
clear button, classes, and attributes.

## References

- [WAI-ARIA: toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- [Adobe Spectrum: Action bar](https://spectrum.adobe.com/page/action-bar/)

---

Lily™ and Lily Design System™ are trademarks.
