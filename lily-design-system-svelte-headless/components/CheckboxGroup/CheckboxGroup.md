# CheckboxGroup

CheckboxGroup is a headless fieldset container that groups related checkboxes under the ARIA `group` role. It manages a collection of checkboxes with shared state, supporting a "Select all" checkbox with automatic indeterminate state, group-level disabled state, and two-way binding of selected values.

Use CheckboxGroup when you need multiple checkboxes that share a logical relationship, such as selecting features, choosing categories, or picking multiple items from a list. The component wraps native checkbox inputs in a `<fieldset>` element, ensuring proper semantic grouping and accessibility without imposing any visual styling.

## Implementation Notes

- Renders a `<fieldset>` element with `role="group"` for explicit ARIA semantics
- The `aria-label` attribute on the fieldset provides an accessible name for the group
- Consumer provides checkbox children (typically `<label>` elements wrapping `<input type="checkbox">`)
- Spreads `restProps` onto the fieldset for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing for all props
- No internal state management; checkbox selection is handled by native checkbox behavior
- Supports group-level `disabled` via native `<fieldset>` disabled attribute

## Props

- `label`: string (required) -- accessible label for the checkbox group, applied via `aria-label`
- `disabled`: boolean (default: false) -- disables all child inputs via native fieldset disabled
- `children`: Snippet (required) -- checkbox elements to render inside the fieldset
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Usage

```svelte
<CheckboxGroup label="Features">
  <label><input type="checkbox" name="features" value="wifi" /> Wi-Fi</label>
  <label><input type="checkbox" name="features" value="bluetooth" /> Bluetooth</label>
</CheckboxGroup>
```

## Keyboard Interactions

- Tab: Moves focus between checkboxes within the group (native browser behavior)
- Space: Toggles the focused checkbox checked state (native browser behavior)

## ARIA

- `role="group"` -- identifies the fieldset as a group of related checkboxes
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose

## References

- WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/checkbox/
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
