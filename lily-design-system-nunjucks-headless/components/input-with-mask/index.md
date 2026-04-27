# InputWithMask

an input displaying a format mask placeholder for the user to fill in

## Description

InputWithMask is a `<div>` wrapper containing a decorative mask
display span and a real `<input type="text">`. The mask string
(e.g. `(___) ___-____`) is rendered both as the visible overlay and
as a `data-mask` attribute so consumer JavaScript can keep the
overlay synchronized with the input value.

This component is inspired by the U.S. Web Design System (USWDS)
input mask pattern.

## HTML tag

`<div>`

## CSS class

`input-with-mask`

## Params

- `label` — string. **Required.** `aria-label` for the input.
- `mask` — string. **Required.** Format mask such as `(___) ___-____`.
- `value` — string. Default `""`. Input value.
- `placeholder` — string. Optional placeholder.
- `name` — string.
- `inputId` — string. id for the inner `<input>`.
- `disabled` — boolean.
- `required` — boolean.
- `id` — string. id for the outer `<div>`.
- `classes` — string. Consumer-provided extra CSS classes (on the
  wrapper).
- `attributes` — object. Extra HTML attributes on the wrapper.

## Usage

```njk
{% from "components/input-with-mask/macro.njk" import inputWithMask %}

{{ inputWithMask({
  label: "Phone number",
  mask: "(___) ___-____",
  placeholder: "(555) 555-5555"
}) }}
```

## Accessibility

- The mask display span uses `aria-hidden="true"` so screen readers
  do not read out the underscores.
- The accessible name comes from the input's `aria-label`.

## Behaviour

This is a headless component — masking behaviour (such as inserting
literal `(`, `)`, ` `, and `-` characters as the user types) is the
consumer's responsibility. The `data-mask` attribute exposes the
mask pattern to consumer JavaScript.

## Headless

No CSS or JavaScript bundled. Sub-element classes
(`input-with-mask-display`, `input-with-mask-control`) are styling
hooks only.

## Testing

`components/input-with-mask/macro.test.js` verifies the base class,
`data-mask`, decorative mask span with `aria-hidden`, the input's
`aria-label`, and prop pass-through.

## References

- [USWDS: Input mask](https://designsystem.digital.gov/components/input-mask/)
