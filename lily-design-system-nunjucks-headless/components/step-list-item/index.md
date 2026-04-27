# StepListItem

one step in a step list with status of waiting, in progress, finished, or error

## Description

StepListItem renders a `<li class="step-list-item">` representing a
single step in a multi-step process. The lifecycle status is exposed
as `data-status` for consumer CSS hooks; the active step is marked
with `aria-current="step"`.

## HTML tag

`<li>`

## CSS class

`step-list-item`

## Params

- `status` — `"waiting" | "in-progress" | "finished" | "error"`.
  Default `"waiting"`. Rendered as `data-status`.
- `current` — boolean. Default `false`. When `true`, renders
  `aria-current="step"`.
- `label` — string. Optional `aria-label` override.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes.

## Usage

```njk
{% from "components/step-list-item/macro.njk" import stepListItem %}

{{ stepListItem({
  status: "in-progress",
  current: true,
  html: "<strong>Shipping</strong><span>Choose a carrier</span>"
}) }}
```

Inside a `step-list`:

```njk
{% from "components/step-list/macro.njk" import stepList %}
{% from "components/step-list-item/macro.njk" import stepListItem %}

{% call stepList({ label: "Checkout" }) %}
  {{ stepListItem({ status: "finished", text: "Cart" }) }}
  {{ stepListItem({ status: "in-progress", current: true, text: "Shipping" }) }}
  {{ stepListItem({ status: "waiting", text: "Payment" }) }}
{% endcall %}
```

## Accessibility

- `aria-current="step"` marks the active step.
- The visible textual label inside each item should describe what
  the step does ("Shipping", "Payment", etc.). Provide `label` only
  when the visible content is ambiguous (e.g., icon-only steps).

## Headless

No CSS or JavaScript is bundled. Consumers style each `data-status`
state.

## Testing

`components/step-list-item/macro.test.js` verifies the base class,
default and custom `data-status`, `aria-current` rendering, content
slots, and pass-through.

## References

- [WAI-ARIA: aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)
- [Ant Design: Steps](https://ant.design/components/steps)
