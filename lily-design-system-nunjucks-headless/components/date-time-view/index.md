# DateTimeView

a read-only display of a formatted date and time

## Description

DateTimeView renders a semantic `<time>` element with a machine-readable
`datetime` attribute (ISO 8601) and a human-readable display string
provided by the consumer. The component does **not** localize — pass a
pre-formatted string via `format`, `text`, or `html`.

## HTML tag

`<time>`

## CSS class

`date-time-view`

## Params

- `value` — string. ISO 8601 datetime. Required (used as the
  `datetime` attribute).
- `format` — string. Pre-formatted display text fallback.
- `text` — string. Plain text override (escaped).
- `html` — string. Raw HTML override.
- `label` — string. Optional `aria-label`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Display text fallback order

1. `html` (raw)
2. `text`
3. caller block
4. `format`
5. `value`

## Usage

```njk
{% from "components/date-time-view/macro.njk" import datetimeView %}

{{ datetimeView({
  value: "2026-04-27T15:00:00Z",
  format: "27 April 2026, 3:00 pm"
}) }}
```

## Accessibility

- The `<time>` element gives implicit datetime semantics to assistive
  technologies via the `datetime` attribute.
- `aria-label` is optional.

## Internationalization

- All visible text comes from `format`, `text`, or `html` — the
  consumer is responsible for locale-aware formatting (for example
  using `Intl.DateTimeFormat`).

## Headless

No CSS or styling — this component only emits semantic markup.

## Testing

`components/date-time-view/macro.test.js` verifies the `<time>`
element, `datetime` attribute, and the display fallback order.

## References

- [MDN: `<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)
