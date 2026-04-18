# DatetimeLocalInput

A datetime-local input allows users to select both a date and time using the native `<input type="datetime-local">` element. It provides accessible labelling via `aria-label` and a bindable value for reactive form state.

This component is useful for scheduling interfaces, event creation forms, appointment booking, and any scenario where both date and time must be captured in a single field. The value follows the format `YYYY-MM-DDThh:mm`, and the browser provides the native date-time picker UI.

## Implementation Notes

- Renders a single `<input type="datetime-local">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Uses Svelte 5 `$bindable()` for two-way binding on the `value` prop
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

```svelte
<DatetimeLocalInput label="Event start" bind:value />
```

```svelte
<DatetimeLocalInput label="Appointment" bind:value min="2024-01-01T08:00" max="2024-12-31T18:00" />
```

```svelte
<DatetimeLocalInput label="Departure time" bind:value required disabled={isLocked} />
```

## Keyboard Interactions

- Tab: Moves focus to and from the datetime input (native browser behavior)
- Arrow keys: Navigate within the datetime picker fields (native browser behavior)
- Enter: Opens or confirms the datetime picker (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the datetime input since there is no visible `<label>` element

## References

- MDN datetime-local input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
