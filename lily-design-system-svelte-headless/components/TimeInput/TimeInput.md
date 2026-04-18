# TimeInput

A time input provides a field for entering time values using the native HTML `<input type="time">` element. It renders a time picker control appropriate to the user's browser and operating system, allowing users to enter hours and minutes in a localized format.

This component is useful for scheduling interfaces, appointment forms, event planners, and any form that requires time-of-day entry. The bindable value uses HH:MM format (24-hour) and supports required and disabled states. It uses `aria-label` for accessibility.

## Implementation Notes

- Renders a native `<input type="time">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Uses `$bindable()` for the `value` prop, enabling `bind:value` in the parent
- Uses Svelte `bind:value` internally for reactive two-way binding
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

```svelte
<TimeInput label="Start time" bind:value />
```

```svelte
<TimeInput label="Meeting time" bind:value={meetingTime} required={true} />
```

```svelte
<TimeInput label="Deadline" bind:value={deadline} min="09:00" max="17:00" />
```

## Keyboard Interactions

None beyond native input behavior -- the browser's built-in time picker handles keyboard interactions (arrow keys to adjust hours/minutes, Tab between segments).

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## References

- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
