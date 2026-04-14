# Datetime Local Input

A datetime-local input allows users to select both a date and time using the native `<input type="datetime-local">` element. It provides accessible labelling via `aria-label` and a bindable value for reactive form state.

This component is useful for scheduling interfaces, event creation forms, appointment booking, and any scenario where both date and time must be captured in a single field. The value follows the format `YYYY-MM-DDThh:mm`, and the browser provides the native date-time picker UI.

## Implementation Notes

- Renders a single `<input type="datetime-local">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Supports two-way binding on the `value` prop
- The browser provides the native datetime picker UI
- Spreads `restProps` onto the input element for consumer extensibility

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable datetime string (format: YYYY-MM-DDThh:mm)
- `min`: string (default: undefined) -- minimum allowed datetime
- `max`: string (default: undefined) -- maximum allowed datetime
- `required`: boolean (default: false) -- whether the input is required for form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the input element

## Usage

Scheduling an event with constrained date-time range:

```html
<DatetimeLocalInput label="Meeting start" value={meetingStart} min="2026-01-01T08:00" max="2026-12-31T18:00" required />
```

Booking an appointment:

```html
<DatetimeLocalInput label="Appointment date and time" value={appointmentDatetime} required />
```

Read-only locked departure time:

```html
<DatetimeLocalInput label="Departure" value={departure} disabled={true} />
```

## Keyboard Interactions

- Tab: Moves focus to and from the datetime input (native browser behavior)
- Arrow keys: Navigate within the datetime picker fields (native browser behavior)
- Enter: Opens or confirms the datetime picker (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the datetime input since there is no visible `<label>` element

## When to Use

- Use for entering a combined date and time without timezone in a single field.
- Use when the browser's native datetime-local picker is appropriate.
- Use for scheduling events, booking appointments, or setting deadlines.
- Use when the time zone is not relevant or is handled separately.

## When Not to Use

- Do not use when you need a "Now" shortcut button -- use DateTimeNowInput instead.
- Do not use when day, month, and year need separate fields -- use DateField instead.
- Do not use when only a date is needed -- use DateInput instead.
- Do not use when only a time is needed -- use TimeInput instead.

## Headless

This headless component provides a native `<input type="datetime-local">` with accessible labeling via `aria-label`, two-way value binding, and standard form attributes. The browser supplies the native datetime picker UI. The consumer provides all visual styling, layout, and any custom validation feedback.


## Styles

The consumer provides all CSS styling. The component renders with a `.datetime-local-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `datetime-local-input`
- Verify aria-label={label}` -- provides an accessible name for the datetime input since there is no visible `<label>` element
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place the datetime input near contextual information (e.g., time zone indicator) so users understand the expected format. Ensure sufficient width for the native picker to display properly.
- **Developers**: Use the `min` and `max` props to constrain selectable datetimes. Remember that the value format is `YYYY-MM-DDThh:mm`, not a full ISO 8601 string.

## References

- MDN datetime-local input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
