# ValidationList

a live-feedback list of input validation rules with pending, passed,
and failed states

## Description

ValidationList is a `<ul>` with `aria-live="polite"` that contains
zero or more `ValidationListItem` children. As item statuses change
(for example from `pending` to `passed`), the polite live region
announces the change to assistive technology.

This component is inspired by the U.S. Web Design System (USWDS)
validation pattern.

## HTML tag

`<ul>`

## CSS class

`validation-list`

## Params

- `label` — string. **Required.** `aria-label` for the list (usually
  describing the field, e.g. "Password requirements").
- `text` — string. Optional escaped fallback text.
- `html` — string. Raw HTML content rendered via `| safe`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/validation-list/macro.njk" import validationList %}
{% from "components/validation-list-item/macro.njk" import validationListItem %}

{% call validationList({ label: "Password requirements" }) %}
  {{ validationListItem({ text: "At least 8 characters", status: "pending" }) }}
  {{ validationListItem({ text: "One uppercase letter", status: "passed" }) }}
  {{ validationListItem({ text: "One number", status: "failed" }) }}
{% endcall %}
```

## Accessibility

- `aria-live="polite"` is the headless contract that makes status
  changes to child items announced by screen readers without
  interrupting the user.
- `aria-label` names the list.

## Headless

No CSS or JavaScript bundled. The consumer updates the
`status` of each `ValidationListItem` as the input value changes.

## Testing

`components/validation-list/macro.test.js` verifies the base class,
`aria-label`, `aria-live="polite"`, child rendering, and prop
pass-through.

## References

- [USWDS: Validation](https://designsystem.digital.gov/components/validation/)
- [WAI-ARIA: aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)

---

Lily™ and Lily Design System™ are trademarks.
