# Month Input

MonthInput is a headless component that wraps a native `<input type="month">` element with accessible labelling for selecting a month and year. It provides a bindable value and supports common form input states like required and disabled.

This component is useful for date-related forms where the user needs to select a specific month, such as credit card expiration dates, report periods, billing cycles, or start/end dates at month granularity. The native month input provides a browser-provided picker interface where supported.

## Implementation Notes

- Renders a native `<input type="month">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding, storing the month in `YYYY-MM` format
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization (e.g., `min`, `max`, `id`, `name`)
- pattern: `two-way binding` for the value prop

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current month value in `YYYY-MM` format; bindable with two-way `value` binding
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

Credit card expiry month:

```html
<MonthInput label="Card expiry" value={expiryMonth} required />
```

Reporting period selection with constraints:

```html
<MonthInput label="Report month" value={reportMonth} min="2025-01" max="2026-12" />
```

Billing cycle start:

```html
<MonthInput label="Billing start month" value={billingMonth} />
```

## Keyboard Interactions

None at the component level. Keyboard behavior is handled natively by the browser's month input implementation.

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the month input

## When to Use

- Use for selecting a month and year, such as credit card expiry or reporting period.
- Use when day-level precision is not needed and month granularity is sufficient.
- Use for billing cycles, subscription renewal dates, or financial reporting periods.

## When Not to Use

- Do not use when a full date is needed -- use DateInput instead.
- Do not use when a week is needed -- use WeekInput instead.
- Do not use when day-level precision is required -- use DateInput or DateField instead.

## Headless

This headless component wraps a native `<input type="month">` with `aria-label` for accessible naming and two-way bindable value in `YYYY-MM` format. The consumer provides all visual styling, including input dimensions, borders, calendar icon, and any custom picker UI for browsers without native month picker support.


## Styles

The consumer provides all CSS styling. The component renders with a `.month-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `month-input`
- Verify aria-label={label}` -- provides an accessible name describing the purpose of the month input
- Verify pass-through attributes are applied

## Advice

- **Designers**: Be aware that native month picker appearance varies widely across browsers; plan fallback styling or a custom picker for consistent cross-browser experience.
- **Developers**: The value format is always `YYYY-MM`. Use `min` and `max` via restProps to constrain the selectable range when needed.

## References

- HTML month input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month
