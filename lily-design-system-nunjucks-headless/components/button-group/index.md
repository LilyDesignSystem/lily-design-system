# ButtonGroup

a wrapper that groups related buttons together

## Description

ButtonGroup is a `<div>` with `role="group"` that wraps a set of
related buttons (for example: Save / Cancel, Yes / No / Maybe). The
group is named with `aria-label` so assistive technology can announce
the relationship between the buttons.

This component is inspired by the U.S. Web Design System (USWDS)
button group pattern.

## HTML tag

`<div role="group">`

## CSS class

`button-group`

## Params

- `label` — string. **Required.** `aria-label` for the group.
- `text` — string. Optional escaped fallback text.
- `html` — string. Raw HTML content rendered via `| safe`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/button-group/macro.njk" import buttonGroup %}

{% call buttonGroup({ label: "Form actions" }) %}
  <button type="submit">Save</button>
  <button type="button">Cancel</button>
{% endcall %}
```

## Accessibility

- `role="group"` plus `aria-label` provides a programmatic name for
  the collection of buttons.
- Each child button retains its own accessible name.

## Headless

No CSS or JavaScript bundled. The consumer styles spacing, layout,
and any visual segmentation between buttons.

## Testing

`components/button-group/macro.test.js` verifies the base class,
`role="group"`, `aria-label`, child rendering, classes pass-through,
and attributes pass-through.

## References

- [USWDS: Button group](https://designsystem.digital.gov/components/button-group/)
- [WAI-ARIA: group role](https://www.w3.org/TR/wai-aria-1.2/#group)

---

Lily™ and Lily Design System™ are trademarks.
