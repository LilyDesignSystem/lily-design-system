# ContextualHelp

a help button that opens a popover with explanatory content

## Description

ContextualHelp pairs a small `<button class="contextual-help-trigger">`
with a `<div class="contextual-help-panel" role="dialog">`. The
button advertises itself with `aria-haspopup="dialog"`,
`aria-expanded`, `aria-controls`, and an `aria-label`. The panel is
toggled by the `hidden` attribute based on `params.expanded`.

The Nunjucks macro does not generate ids dynamically. Pass
`params.id` for the panel; the trigger references it via
`aria-controls`. When `params.id` is omitted the panel id falls
back to `contextual-help-panel`.

The default trigger glyph is `?`. Override it with `triggerHtml`
(raw HTML, e.g. an SVG) or `triggerText` (escaped text).

## HTML tag

`<div>` with a child `<button>` and a child `<div role="dialog">`.

## CSS class

`contextual-help`

## Params

- `label` — string. **Required.** `aria-label` for the help trigger
  button.
- `expanded` — boolean. Default `false`. Whether the popover is open.
- `triggerHtml` — string. Optional raw HTML for the trigger button
  content.
- `triggerText` — string. Optional escaped text for the trigger
  button content.
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
  expanded: false,
  html: "<p>Type your full legal name as it appears on your ID.</p>"
}) }}
```

## Accessibility

- Trigger: `aria-haspopup="dialog"`, `aria-expanded`,
  `aria-controls`, `aria-label`.
- Panel: `role="dialog"` with the id referenced by the trigger.
- Visibility uses the native `hidden` attribute.

## Headless

No CSS or JavaScript bundled. The consumer wires up the trigger
click handler, focus management, and styling.

## Testing

`components/contextual-help/macro.test.js` verifies the wrapper
class, trigger ARIA attributes, panel `role="dialog"` and id, the
`hidden` toggle, content rendering, classes, and attributes.

## References

- [WAI-ARIA: dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Adobe Spectrum: Contextual help](https://spectrum.adobe.com/page/contextual-help/)
