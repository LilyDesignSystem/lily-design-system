# TimePickerInput

A time picker input is a component that allows users to select a specific time of day, often used alongside a date picker in forms, scheduling tools, or booking systems. It provides a structured way to enter time values, reducing input mistakes and improving the user experience compared to free-text entry.

This headless component wraps a native `<input type="time">` element with an accessible label and support for two-way binding of the time value. It supports required and disabled states and delegates all visual presentation to the consumer.

## Implementation Notes

- Uses a native `<input type="time">` element for built-in browser time selection behavior
- Supports `$bindable()` for two-way binding of the `value` prop
- Native input handles 12-hour/24-hour format based on browser locale
- Accepts `...restProps` for forwarding additional attributes to the input element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current time value in HH:MM format; bindable
- `required`: boolean (default: false) -- whether a value is required for form submission
- `disabled`: boolean (default: false) -- whether the input is disabled

## Usage

```svelte
<TimePickerInput label="Appointment time" bind:value />
```

```svelte
<TimePickerInput label="Departure time" bind:value required />
```

## Keyboard Interactions

- Tab: Move focus to/from the time input
- Up Arrow / Down Arrow: Increment/decrement the focused time segment (hours, minutes, AM/PM)
- Left Arrow / Right Arrow: Move between time segments within the input

(These are provided by the native `<input type="time">` element.)

## ARIA

- `aria-label={label}` -- provides an accessible name for the time input

## References

- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
