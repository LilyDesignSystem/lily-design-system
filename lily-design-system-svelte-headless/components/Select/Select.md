# Select

A select is a headless component that wraps the native HTML `<select>` element, providing a dropdown menu for choosing one option from a list. It is commonly used in forms for selecting a country, category, status, or any other value from a predefined set of choices.

The consumer provides `<option>` elements as children, giving full control over the available choices. The component uses `aria-label` for accessible naming and supports two-way binding on the selected value via Svelte 5 `$bindable()`.

## Implementation Notes

- Renders a single `<select>` element containing consumer-provided `<option>` children
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Uses Svelte 5 `$bindable()` for two-way binding on the `value` prop
- Uses Svelte 5 Snippet for the `children` prop to render `<option>` elements
- Spreads `restProps` onto the select element for consumer extensibility

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable string representing the currently selected value
- `required`: boolean (default: false) -- whether the select is required for form submission
- `disabled`: boolean (default: false) -- whether the select is disabled
- `children`: Snippet (required) -- `<option>` elements to render inside the select
- `...restProps`: unknown -- additional attributes spread onto the select element

## Usage

```svelte
<Select label="Country" bind:value>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
</Select>
```

```svelte
<Select label="Priority" bind:value={priority} required>
  <option value="">Select priority...</option>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</Select>
```

```svelte
<Select label="Status" bind:value disabled={isReadOnly}>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</Select>
```

## Keyboard Interactions

- Tab: Moves focus to and from the select element (native browser behavior)
- Space/Enter: Opens the dropdown list when focused (native browser behavior)
- Arrow Up/Down: Navigates through options (native browser behavior)
- Escape: Closes the dropdown list (native browser behavior)
- Home/End: Jumps to first/last option (native browser behavior)
- Type-ahead: Typing characters jumps to matching options (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the select element since there is no visible `<label>` element
- The `<select>` element implicitly has `role="combobox"` or `role="listbox"` depending on the browser, with built-in accessible semantics

## References

- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
