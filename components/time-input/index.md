# Time Input

A time input provides a field for entering time values using the native HTML `<input type="time">` element. It renders a time picker control appropriate to the user's browser and operating system, allowing users to enter hours and minutes in a localized format.

This component is useful for scheduling interfaces, appointment forms, event planners, and any form that requires time-of-day entry. The bindable value uses HH:MM format (24-hour) and supports required and disabled states. It uses `aria-label` for accessibility.

## Implementation Notes

- Renders a native `<input type="time">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports two-way binding for the `value` prop, enabling two-way `value` binding in the parent
- Supports two-way binding on the `value` prop
- Value format is HH:MM (24-hour time string, e.g., "14:30")
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `min`, `max`, `step`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current time value in HH:MM format, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

Appointment scheduling with business hours constraint:

```html
<TimeInput label="Appointment time" value={appointmentTime} min="09:00" max="17:00" required />
```

Shift start and end times:

```html
<TimeInput label="Shift start" value={shiftStart} required />
<TimeInput label="Shift end" value={shiftEnd} required />
```

Medication schedule entry:

```html
<TimeInput label="Take medication at" value={medTime} />
```

## Keyboard Interactions

None beyond native input behavior -- the browser's built-in time picker handles keyboard interactions (arrow keys to adjust hours/minutes, Tab between segments).

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## When to Use

- Use for entering a time value using the native browser time picker.
- Use for appointment times, medication schedules, or shift start and end times.
- Use for straightforward time-of-day entry where the native browser time picker is sufficient.
- Use when any arbitrary time value should be accepted.

## When Not to Use

- Do not use when a dropdown of predefined time slots is better -- use TimePickerInput instead.
- Do not use for combined date-and-time entry -- use DateTimeNowInput or DatetimeLocalInput instead.
- Do not use for time duration or elapsed time; consider a custom duration input instead.

## Headless

This headless component provides a native `<input type="time">` element with `aria-label`, two-way value binding, and support for `required` and `disabled` states. The browser provides the time picker UI. The consumer provides all visual styling and any surrounding label or hint text.


## Styles

The consumer provides all CSS styling. The component renders with a `.time-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `time-input`
- Verify aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included
- Verify pass-through attributes are applied

## Advice

- **Designers**: Pair the time input with a visible label and hint text showing the expected format, since native time picker appearance varies by browser.
- **Developers**: Use `min` and `max` attributes via restProps to constrain valid time ranges (e.g., business hours). The value is always in 24-hour HH:MM format regardless of display locale.

## References

- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
