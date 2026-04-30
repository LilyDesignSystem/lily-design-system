# DateTimeView

A read-only display of a formatted date and time. Renders a semantic HTML `<time>` element whose `datetime` attribute carries the machine-readable ISO 8601 value while the visible text comes from the default slot, the `format` prop, or (as a fallback) the raw `value`.

## Implementation Notes

- Headless: no CSS, no formatting
- Display text precedence: default slot → `format` prop → `value`
- The `value` prop is required and used for the `datetime` attribute

## Props

- `value`: string (required) — ISO 8601 datetime
- `format`: string (optional) — pre-formatted human-readable text
- `label`: string (optional) — `aria-label` override
- default slot — overrides `format` when present
- `...$attrs` — additional HTML attributes

## Usage

```vue
<DateTimeView value="2026-04-27T10:00:00Z" format="Apr 27, 2026" />

<DateTimeView value="2026-04-27T10:00:00Z">
    <strong>Today</strong>
</DateTimeView>
```

## Keyboard Interactions

- None — read-only.

## ARIA

- Implicit `<time>` semantics
- Optional `aria-label`

## When to Use

- Displaying timestamps, publish dates, last-updated times

## When Not to Use

- For relative times that should auto-update — wrap in a parent component that re-renders

## Headless

The component does not localize or format. Consumers must supply human-readable text via the `format` prop or default slot.

## Testing

- Verify root is `<time>` with `date-time-view` class
- Verify `datetime` attribute matches `value`
- Verify text precedence: slot > format > value
- Verify `aria-label` and pass-through

## References

- [MDN: `<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)
