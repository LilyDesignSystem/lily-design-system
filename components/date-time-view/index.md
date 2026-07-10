# DateTime View

A datetime view is a read-only display of a formatted date and/or time using
the semantic `<time>` element so that browsers and assistive technology can
understand the underlying ISO 8601 value while users see a localized
human-friendly rendering supplied by the consumer.

Use it whenever you display a timestamp (publish date, last update, event
start) and want both machine-readable semantics and a presentation string
that the consumer has formatted in the user's locale.

## Implementation Notes

- Renders a `<time>` element so the value is machine-readable
- Sets `datetime={value}` from the ISO 8601 string
- Display text falls back: `children` → `format` → `value`
- Does not perform any localization — the consumer formats the displayed text
- Sets `class="date-time-view"`

## Props

- `value`: string (required) -- ISO 8601 datetime
- `format`: string (optional) -- pre-formatted display text
- `label`: string (optional) -- aria-label override
- `children`: slot (optional) -- content overrides `format`
- `...restProps`: any additional HTML attributes

## Usage

ISO value with consumer-formatted display:

```html
<DateTimeView value="2026-04-27T14:30:00Z" format="April 27, 2026 at 2:30 PM" />
```

Children slot for richer rendering:

```html
<DateTimeView value="2026-04-27">
  <strong>27 Apr 2026</strong>
</DateTimeView>
```

Falling back to the raw ISO value:

```html
<DateTimeView value="2026-04-27T14:30:00Z" />
```

## Keyboard Interactions

- None -- this is a passive read-only display.

## ARIA

- Implicit semantics from `<time>` with the `datetime` attribute
- `aria-label` rendered only when the `label` prop is provided

## When to Use

- Use to display timestamps in articles, comments, activity feeds, and notifications.
- Use any time you want the rendered date to be machine-readable for browsers, search engines, and assistive technology.

## When Not to Use

- Do not use for editable date inputs (use DateInput, DateTimeLocalInput, etc.).
- Do not use for date-range displays (use DateRange).
- Do not use to perform localization — format upstream and pass via `format` or `children`.

## Headless

Provides a single `<time>` element with the correct `datetime` attribute and
display text fallback chain. Locale formatting, relative-time computation,
and any visual treatment are the consumer's responsibility.

## Styles

The consumer styles the `date-time-view` class. A common pattern wraps the
component to apply font-variant-numeric or letter-spacing for tabular dates.

## Testing

- Verify the component renders a `<time>` element with class `date-time-view`
- Verify the `datetime` attribute equals the `value` prop
- Verify display text uses children if provided, then `format`, then `value`
- Verify `aria-label` is set when the `label` prop is provided

## Advice

- **Designers**: Decide whether absolute ("April 27, 2026") or relative ("3 hours ago") formatting fits the context. Pass either via `format` or `children`.
- **Developers**: Always pass an ISO 8601 value to `value` so the underlying `datetime` attribute remains machine-readable, even if your display text is relative or partial.

## Related components

- `date-time-local-input` — an input for entering a date and time without time zone <input type="datetime-local">
- `date-range` — a display of a start and end date range
- `review-date` — a display of a content review date

## References

- MDN time element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601: https://www.iso.org/iso-8601-date-and-time-format.html

---

Lily™ and Lily Design System™ are trademarks.
