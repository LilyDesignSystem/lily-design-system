# StepList

an ordered list of step items showing progress through a multi-step process

## Description

StepList renders an `<ol class="step-list">` whose children are
typically `step-list-item` macros. The native `<ol>` element provides
list semantics so screen readers count and announce each step.

The optional `current` prop is exposed as `data-current` for consumer
CSS hooks (e.g., to highlight the active step).

## HTML tag

`<ol>`

## CSS class

`step-list`

## Params

- `label` — string. Optional `aria-label`.
- `current` — number. Index of the current step (0-based) exposed as
  `data-current`.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes.

## Usage

```njk
{% from "components/step-list/macro.njk" import stepList %}
{% from "components/step-list-item/macro.njk" import stepListItem %}

{% call stepList({ label: "Checkout progress", current: 1 }) %}
  {{ stepListItem({
    status: "finished",
    html: "<span>Cart</span>"
  }) }}
  {{ stepListItem({
    status: "in-progress",
    current: true,
    html: "<span>Shipping</span>"
  }) }}
  {{ stepListItem({
    status: "waiting",
    html: "<span>Payment</span>"
  }) }}
{% endcall %}
```

## Accessibility

- `<ol>` provides list semantics natively.
- Provide `aria-label` when the list has no visible heading.
- Each step's "current" status is communicated via `aria-current="step"`
  on the matching `step-list-item`.

## Headless

No CSS or JavaScript is bundled.

## Testing

`components/step-list/macro.test.js` verifies the base class,
optional `aria-label`, the `data-current` attribute, and slot
pass-through.

## References

- [WAI-ARIA: aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)
- [Ant Design: Steps](https://ant.design/components/steps)

---

Lily™ and Lily Design System™ are trademarks.
