# ContextualHelp

a help button that opens a popover with explanatory content

## Description

ContextualHelp pairs a small `<button class="contextual-help-trigger">`
with a `<div class="contextual-help-panel" role="dialog" popover="auto">`.
The button advertises itself with `aria-haspopup="dialog"`,
`aria-controls` and an `aria-label`, and opens the panel with
`command="toggle-popover"` `commandfor` and `popovertarget`: the
browser opens it, and closes it on Escape or a click outside, with no
script. A closed trigger carries no static `aria-expanded` (nothing
would update it); the browser exposes a `popovertarget` trigger's
expanded state. `expanded: true` renders the panel in place, without
`popover`, since a popover cannot start open without script.

The Nunjucks macro does not generate ids dynamically. Pass
`params.id` for the panel; the trigger references it via
`aria-controls`. When `params.id` is omitted the panel id falls
back to `contextual-help-panel`.

There is no default trigger glyph: pass `triggerLabel` (escaped text,
such as `?` or `؟`) or `triggerHtml` (raw HTML, e.g. an SVG).
`triggerText` is the older name for `triggerLabel`.

## HTML tag

`<div>` with a child `<button>` and a child `<div role="dialog">`.

## CSS class

`contextual-help`

## Params

- `label` — string. **Required.** `aria-label` for the help trigger
  button.
- `expanded` — boolean. Default `false`. Whether the popover is open.
- `triggerLabel` — string. **Required** (no default). Visible escaped
  text of the trigger, such as `?`.
- `triggerHtml` — string. Raw HTML for the trigger content instead.
- `triggerText` — string. Older name for `triggerLabel`.
- `id` — string. Optional id for the panel; the trigger references
  it via `aria-controls`.
- `text` — string. Plain text content (escaped) for the panel.
- `html` — string. Raw HTML content for the panel.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs
  applied to the wrapper.

## Usage

```njk
{% from "components/contextual-help/macro.njk" import contextualHelp %}

{{ contextualHelp({
  id: "name-help",
  label: "Help: Full name",
  triggerLabel: "?",
  html: "<p>Type your full legal name as it appears on your ID.</p>"
}) }}
```

## Accessibility

- Trigger: `aria-haspopup="dialog"`, `aria-controls`, `aria-label`,
  `command="toggle-popover"`, `commandfor`, `popovertarget`.
- Panel: `role="dialog"` with the id referenced by the trigger.
- Visibility is the Popover API (`popover="auto"`): no script.

## Headless

No CSS or JavaScript bundled, and none needed: the browser opens and
closes the panel. Styling and positioning are the consumer's.

## Testing

`components/contextual-help/macro.test.js` verifies the wrapper
class, trigger ARIA attributes, panel `role="dialog"` and id, the
`popover` / `commandfor` wiring, content rendering, classes, and attributes.

## References

- [WAI-ARIA: dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Adobe Spectrum: Contextual help](https://spectrum.adobe.com/page/contextual-help/)

---

Lily™ and Lily Design System™ are trademarks.
