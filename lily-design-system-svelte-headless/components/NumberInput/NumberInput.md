# NumberInput

NumberInput is a headless component that wraps a native `<input type="number">` element with accessible labelling and optional min, max, and step constraints. It provides a bindable numeric value for two-way data flow.

This component is useful for quantity selectors, age inputs, price fields, configuration values, or any form field that accepts numeric input. The native number input provides browser-built-in validation, increment/decrement controls, and appropriate virtual keyboard on mobile devices.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses `$bindable(undefined)` for two-way binding with an initial undefined state
- Supports optional `min`, `max`, and `step` constraints
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization (e.g., `id`, `name`, `placeholder`)
- Svelte 5 pattern: `$bindable` for the value prop

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current numeric value; bindable with `bind:value`
- `min`: number (optional) -- minimum allowed value
- `max`: number (optional) -- maximum allowed value
- `step`: number (optional) -- increment/decrement step size
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```svelte
<NumberInput label="Quantity" bind:value min={0} max={100} step={1} />
```

## Keyboard Interactions

None at the component level. Keyboard behavior is handled natively by the browser's number input implementation (Up/Down arrows to increment/decrement).

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the number input

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role (implicit): https://www.w3.org/TR/wai-aria-1.2/#spinbutton
