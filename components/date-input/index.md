# Date Input

A date input provides a headless native HTML date input element with accessible labelling via `aria-label`. It is a minimal wrapper for `<input type="date">` that leverages the browser's built-in date picker for date selection.

This component is useful in forms where users need to enter a calendar date. The value is stored in ISO 8601 `YYYY-MM-DD` format. It supports min and max constraints to restrict the allowable date range, and integrates with two-way binding for reactive form state.

## Implementation Notes

- Renders a single `<input type="date">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Supports two-way binding on the `value` prop
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

```html
<Fieldset legend="What is your date of birth?">
  <Hint>For example, 15 3 1984</Hint>
  <DateInput label="Date of birth" autocomplete="bday" />
</Fieldset>
```

```html
<Fieldset legend="When did your symptoms start?">
  <Hint>For example, 27 11 2024</Hint>
  <DateInput label="Symptom start date" />
</Fieldset>
```

```html
<DateInput label="Deadline" value={value} min="2024-01-01" max="2024-12-31" required />
```

## Keyboard Interactions

- Tab: Moves focus to and from the date input (native browser behavior)
- Arrow keys: Navigate within the date picker fields (native browser behavior)
- Enter: Opens or confirms the date picker (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the date input since there is no visible `<label>` element

## When to Use

- Use when asking users for a date they already know, such as their date of birth or a specific appointment date
- Use within a Fieldset with a legend that poses the date question, such as "What is your date of birth?"
- Use with Hint to show the expected format, for example "For example, 15 3 1984"
- Use with autocomplete attributes (bday-day, bday-month, bday-year) for date of birth fields

## When Not to Use

- Do not use when users are unlikely to know the exact date — consider a DateField with flexible input or a CalendarRangePicker
- Do not use for selecting a date from a constrained range — use CalendarTable or CalendarRangePicker instead
- Do not use for date-and-time entry — use DateTimeNowInput or separate DateInput and TimeInput fields
- Do not use a single text field for dates — three separate fields (day, month, year) reduce errors

## Headless

This headless DateInput component provides a native `<input type="date">` with `aria-label` for accessible naming, two-way binding on the `value` prop, and `min`/`max` constraints for date range validation. The consumer provides all visual styling including input appearance, calendar icon, and any surrounding label or helper text.


## Styles

The consumer provides all CSS styling. The component renders with a `.date-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `date-input`
- Verify aria-label={label}` -- provides an accessible name for the date input since there is no visible `<label>` element
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the date input is wide enough to display the full date format. Consider showing the expected format (e.g., YYYY-MM-DD) as placeholder or helper text nearby.
- **Developers**: Use ISO 8601 `YYYY-MM-DD` format for `value`, `min`, and `max` props. The browser provides the native date picker UI, which varies across browsers and platforms.

## References

- MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
