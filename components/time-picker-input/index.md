# Time Picker Input

A time picker is a component that allows users to select a specific time of day, often used alongside a date picker in forms, scheduling tools, or booking systems. It provides a structured way to enter time values, reducing input mistakes and improving the user experience compared to free-text entry.

This headless component wraps a native `<input type="time">` element with an accessible label and support for two-way binding of the time value. It supports required and disabled states and delegates all visual presentation to the consumer.

## Implementation Notes

- Uses a native `<input type="time">` element for built-in browser time selection behavior
- Supports two-way binding on the `value` prop
- Native input handles 12-hour/24-hour format based on browser locale
- Accepts `...restProps` for forwarding additional attributes to the input element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current time value in HH:MM format; bindable
- `required`: boolean (default: false) -- whether a value is required for form submission
- `disabled`: boolean (default: false) -- whether the input is disabled

## Usage

Appointment booking with 15-minute intervals:

```html
<TimePickerInput label="Appointment time" value={appointmentTime} step="900" required />
```

Reservation time selection:

```html
<TimePickerInput label="Reservation time" value={reservationTime} />
```

Shift scheduling with constrained hours:

```html
<TimePickerInput label="Shift start" value={shiftStart} min="06:00" max="22:00" step="1800" required />
```

## Keyboard Interactions

- Tab: Move focus to/from the time input
- Up Arrow / Down Arrow: Increment/decrement the focused time segment (hours, minutes, AM/PM)
- Left Arrow / Right Arrow: Move between time segments within the input

(These are provided by the native `<input type="time">` element.)

## ARIA

- `aria-label={label}` -- provides an accessible name for the time input

## When to Use

- Use when users need to select a time from a dropdown list of slots, such as 15-minute or 30-minute intervals.
- Use for appointment booking, scheduling, or reservation systems where specific time slots are offered.
- Use when you want a dedicated time selection component that can be styled independently from a plain time input.

## When Not to Use

- Do not use when any arbitrary time is valid -- use TimeInput instead.
- Do not use for date selection -- use DateInput or CalendarTable instead.
- Do not use for time duration or elapsed time tracking; use a custom duration component instead.

## Headless

This headless component provides a native `<input type="time">` element with `aria-label`, two-way value binding, and `required`/`disabled` states. The browser handles 12-hour/24-hour format based on locale. The consumer provides all visual styling and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.time-picker-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `time-picker-input`
- Verify aria-label={label}` -- provides an accessible name for the time input
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear visual feedback for the selected time and consider adding a visible label above the picker for clarity.
- **Developers**: The `value` is always in HH:MM 24-hour format internally. Use the `step` attribute via restProps to control minute granularity (e.g., `step="900"` for 15-minute intervals).

## References

- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
