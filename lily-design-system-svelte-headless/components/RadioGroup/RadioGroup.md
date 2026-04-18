# RadioGroup

RadioGroup is a headless fieldset container that groups related radio buttons under the ARIA `radiogroup` role. It provides an accessible label for the entire group, enabling screen readers and assistive technologies to communicate the relationship between individual radio buttons.

Use RadioGroup when you need a set of mutually exclusive options, such as selecting a size, choosing a shipping method, or picking a preference. The component wraps native radio inputs in a `<fieldset>` element, ensuring proper semantic grouping and accessibility without imposing any visual styling.

## Implementation Notes

- Renders a `<fieldset>` element with `role="radiogroup"` for explicit ARIA semantics
- The `aria-label` attribute on the fieldset provides an accessible name for the group
- Consumer provides radio button children (typically `<label>` elements wrapping `<input type="radio">`)
- Spreads `restProps` onto the fieldset for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing for all props
- No internal state management; radio selection is handled by native radio input behavior

## Props

- `label`: string (required) -- accessible label for the radio group, applied via `aria-label`
- `children`: Snippet (required) -- radio button elements to render inside the fieldset
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Usage

```svelte
<RadioGroup label="Size">
  <label><input type="radio" name="size" value="s" /> Small</label>
  <label><input type="radio" name="size" value="m" /> Medium</label>
</RadioGroup>
```

## Keyboard Interactions

- Tab: Moves focus into the radio group; within the group, arrow keys move between radio buttons (native browser behavior)
- Arrow Up / Arrow Down: Moves selection between radio buttons within the group (native radio behavior)
- Space: Selects the focused radio button (native radio behavior)

## ARIA

- `role="radiogroup"` -- identifies the fieldset as a group of radio buttons
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
- WAI-ARIA Authoring Practices - Radio Group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
