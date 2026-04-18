# CheckboxInput

A checkbox input is a minimal headless wrapper around the native HTML `<input type="checkbox">` element. Unlike a Checkbox component which includes a wrapping `<label>`, CheckboxInput uses `aria-label` for accessibility, giving consumers full control over label placement and visual presentation.

This component is ideal when you need a bare checkbox that you will wrap in your own custom layout, such as placing the label to the left, using a custom indicator, or integrating into a complex form where label positioning must be controlled by the consumer.

## Implementation Notes

- Renders a single `<input type="checkbox">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a wrapping `<label>` element
- Uses Svelte 5 `$bindable()` for two-way binding on the `checked` prop
- Spreads `restProps` onto the input element for consumer extensibility

## Props

- `checked`: boolean (default: false) -- bindable boolean indicating whether the checkbox is checked
- `label`: string (required) -- accessible name applied via `aria-label`
- `disabled`: boolean (default: false) -- whether the checkbox is disabled
- `required`: boolean (default: false) -- whether the checkbox is required for form submission
- `name`: string (default: undefined) -- form field name attribute
- `id`: string (default: undefined) -- element id attribute
- `value`: string (default: undefined) -- value attribute for form submission
- `...restProps`: unknown -- additional attributes spread onto the input element

## Usage

```svelte
<CheckboxInput label="Accept terms" bind:checked />
```

```svelte
<CheckboxInput label="Subscribe to newsletter" bind:checked={subscribed} disabled={!hasEmail} />
```

```svelte
<CheckboxInput label="Required field" bind:checked required name="agree" value="yes" />
```

## Keyboard Interactions

- Space: Toggles the checkbox checked state (native browser behavior)
- Tab: Moves focus to and from the checkbox (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the checkbox since there is no visible `<label>` element

## References

- MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
- WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/checkbox/
