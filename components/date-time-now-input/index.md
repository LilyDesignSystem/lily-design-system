# Date Time Now Input

DateTimeNowInput is a headless component that wraps a native `<input type="date">`, `<input type="time">`, and a `<button type="button">` inside a `<div>`. The "Now" button sets both inputs to the current local date and time when clicked.

This component is useful for event logging, timestamping, incident reporting, and any scenario where users need to quickly capture the current date and time or manually enter a specific date and time.

## Implementation Notes

- Renders a wrapper `<div>` containing a date input, a time input, and a "Now" button
- The date input is `<input type="date">` for selecting a date
- The time input is `<input type="time">` for selecting a time
- The "Now" button sets both date and time inputs to the current local date and time
- Uses `aria-label` for accessible naming on each input and the button
- Supports two-way binding on the `dateValue` and `timeValue` props
- Spreads `restProps` onto the wrapper `<div>` for consumer extensibility

## Props

- `label`: string (required) -- accessible name for the wrapper group via `aria-label`
- `dateLabel`: string (default: "Date") -- accessible name for the date input via `aria-label`
- `timeLabel`: string (default: "Time") -- accessible name for the time input via `aria-label`
- `nowLabel`: string (default: "Now") -- accessible label and text for the "Now" button
- `dateValue`: string (default: "") -- bindable date string (format: YYYY-MM-DD)
- `timeValue`: string (default: "") -- bindable time string (format: HH:mm)
- `required`: boolean (default: false) -- whether the inputs are required for form submission
- `disabled`: boolean (default: false) -- whether the inputs and button are disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Usage

```html
<DateTimeNowInput label="Event time" />
```

```html
<DateTimeNowInput label="Incident time" dateValue={date} timeValue={time} nowLabel="Set to now" />
```

```html
<DateTimeNowInput label="Appointment" dateValue={date} timeValue={time} required disabled={isLocked} />
```

## Keyboard Interactions

- Tab: Moves focus between the date input, time input, and "Now" button
- Enter/Space on the "Now" button: Sets both inputs to the current date and time
- Arrow keys: Navigate within the date and time picker fields (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the wrapper group
- `aria-label={dateLabel}` -- provides an accessible name for the date input
- `aria-label={timeLabel}` -- provides an accessible name for the time input
- `aria-label={nowLabel}` -- provides an accessible name for the "Now" button

## When to Use

- Use when both a date and a time must be captured and the user frequently needs to record the current moment.
- Use for event logging, incident reporting, timestamping, or time tracking interfaces.
- Avoid when only a date is needed; use DateInput instead.
- Avoid when only a time is needed; use TimeInput instead.
- Consider DatetimeLocalInput when a single combined field is preferred and no "Now" button is needed.

## Headless

This headless component provides a `<div>` wrapping a native `<input type="date">`, `<input type="time">`, and `<button type="button">` with accessible labeling via `aria-label` on each element, two-way value binding for date and time, and a "Now" button that sets both to the current local date and time. The consumer provides all visual styling, layout, and any custom validation feedback.

## Styles

The consumer provides all CSS styling. The component renders with a `.date-time-now-input` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a wrapper `<div>` with class `date-time-now-input`
- Verify it contains an `<input type="date">` with `aria-label`
- Verify it contains an `<input type="time">` with `aria-label`
- Verify it contains a `<button type="button">` with `aria-label`
- Verify clicking the "Now" button sets date and time to current values
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied to the wrapper `<div>`

## Advice

- **Designers**: Place the "Now" button adjacent to the inputs so users can easily discover it. Consider adding a clock icon to the button for visual clarity.
- **Developers**: The "Now" button uses `new Date()` to get the current local date and time. The date format is `YYYY-MM-DD` and time format is `HH:mm` to match native input requirements.

## References

- MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
- MDN time input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
