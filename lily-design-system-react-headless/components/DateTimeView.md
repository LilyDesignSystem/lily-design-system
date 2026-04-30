# DateTimeView

A read-only display of a formatted date and time. Renders a semantic HTML `<time>` element with the machine-readable ISO 8601 value in the `dateTime` attribute, and a human-readable display string supplied by the consumer.

The component does not localize. The consumer is responsible for formatting the display string in the user's locale (using `Intl.DateTimeFormat` or any other library) and passing it via the `format` prop or `children`.

## Implementation Notes

- Renders `<time dateTime={value}>` (React camelCase `dateTime`)
- Display fallback order: `children` -> `format` -> `value`
- Consumer formats the display string; the component does not localize

## Props

- `value`: string (required) -- ISO 8601 datetime string (machine-readable)
- `format`: string (optional) -- pre-formatted display text
- `label`: string (optional) -- `aria-label` override
- `children`: ReactNode (optional) -- custom display content; overrides `format`
- `...restProps`: Any additional HTML attributes passed to the `<time>`

## Usage

```tsx
<DateTimeView value="2026-01-15T09:30:00Z" format="January 15, 2026, 9:30 AM" />

<DateTimeView value="2026-01-15T09:30:00Z" label="Published">
  <strong>Jan 15</strong>, 2026
</DateTimeView>
```

## Keyboard Interactions

- None -- read-only display

## ARIA

- Semantic `<time>` element
- Optional `aria-label` via `label` prop
