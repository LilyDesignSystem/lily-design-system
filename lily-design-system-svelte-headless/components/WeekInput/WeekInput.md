# WeekInput

A week input is a UI/UX component that provides a field for selecting a specific week of the year using the native HTML `<input type="week">` element. It renders a week picker control that allows users to select a year and week number, with values in YYYY-Www format (e.g., "2024-W01"). The component includes aria-label for accessibility and supports bindable value for two-way data binding, along with standard form attributes like required and disabled.

Week inputs are useful for scheduling applications, time tracking systems, reporting tools, and any scenario where data is organized by week rather than by specific date.

## Implementation Notes

- Renders a single `<input type="week">` element for native week picker behavior
- Uses `$bindable()` for the `value` prop enabling two-way data binding with `bind:value`
- Values follow the ISO 8601 week format: YYYY-Www (e.g., "2024-W01" for the first week of 2024)
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `min`, `max`, `class`)
- Browser support varies; some browsers render a native week picker while others fall back to a text input

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current week value in YYYY-Www format, bindable with `bind:value`
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

```svelte
<WeekInput label="Select week" bind:value />
```

```svelte
<WeekInput label="Report week" bind:value={selectedWeek} required />
```

## Keyboard Interactions

When the browser renders a native week picker:

- Up Arrow / Down Arrow: adjust the focused segment (year or week number)
- Left Arrow / Right Arrow: move focus between year and week segments
- Enter: confirm selection / submit form

Note: keyboard interactions depend on the browser's native week picker implementation.

## ARIA

- `aria-label={label}` -- provides the accessible name for the week input since no visible label element is associated

## References

- MDN input type="week": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week
