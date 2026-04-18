# DateInput

A date input provides a headless native HTML date input element with accessible labelling via `aria-label`. It is a minimal wrapper for `<input type="date">` that leverages the browser's built-in date picker for date selection.

This component is useful in forms where users need to enter a calendar date. The value is stored in ISO 8601 `YYYY-MM-DD` format. It supports min and max constraints to restrict the allowable date range, and integrates with Svelte 5 two-way binding for reactive form state.

## Implementation Notes

- Renders a single `<input type="date">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Uses Svelte 5 `$bindable()` for two-way binding on the `value` prop
- The browser provides the native date picker UI
- Spreads `restProps` onto the input element for consumer extensibility

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable date string in YYYY-MM-DD format
- `min`: string (default: undefined) -- minimum allowed date in YYYY-MM-DD format
- `max`: string (default: undefined) -- maximum allowed date in YYYY-MM-DD format
- `required`: boolean (default: false) -- whether the input is required for form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the input element

## Usage

```svelte
<DateInput label="Birth date" bind:value />
```

```svelte
<DateInput label="Deadline" bind:value min="2024-01-01" max="2024-12-31" />
```

```svelte
<DateInput label="Start date" bind:value required disabled={isLocked} />
```

## Keyboard Interactions

- Tab: Moves focus to and from the date input (native browser behavior)
- Arrow keys: Navigate within the date picker fields (native browser behavior)
- Enter: Opens or confirms the date picker (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the date input since there is no visible `<label>` element

## References

- MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
