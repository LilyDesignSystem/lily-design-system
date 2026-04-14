# Number Input

NumberInput is a headless component that wraps a native `<input type="number">` element with accessible labelling and optional min, max, and step constraints. It provides a bindable numeric value for two-way data flow.

This component is useful for quantity selectors, age inputs, price fields, configuration values, or any form field that accepts numeric input. The native number input provides browser-built-in validation, increment/decrement controls, and appropriate virtual keyboard on mobile devices.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Supports optional `min`, `max`, and `step` constraints
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization (e.g., `id`, `name`, `placeholder`)
- pattern: `two-way binding` for the value prop

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current numeric value; bindable with two-way `value` binding
- `min`: number (optional) -- minimum allowed value
- `max`: number (optional) -- maximum allowed value
- `step`: number (optional) -- increment/decrement step size
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

Basic quantity input with range constraints:

```html
<NumberInput label="Quantity" value={quantity} min={0} max={100} step={1} />
```

Age input in a registration form:

```html
<Field label="Age" required>
  <NumberInput label="Age" value={age} min={0} max={150} step={1} required />
</Field>
```

Number input for a configuration setting:

```html
<Field label="Session timeout (minutes)">
  <NumberInput label="Session timeout in minutes" value={timeout} min={1} max={120} step={5} />
</Field>
```

Number input in a product order form:

```html
<Form label="Add to basket" onsubmit={addToBasket}>
  <Field label="Quantity">
    <NumberInput label="Quantity" value={qty} min={1} max={10} step={1} />
  </Field>
  <Button type="submit">Add to basket</Button>
</Form>
```

## Keyboard Interactions

None at the component level. Keyboard behavior is handled natively by the browser's number input implementation (Up/Down arrows to increment/decrement).

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the number input

## When to Use

- Use for form fields that accept numeric values, such as quantity selectors, age inputs, or configuration values.
- Use when you need browser-built-in validation, increment/decrement controls, and numeric virtual keyboards on mobile.
- Use for settings or preferences that require a bounded numeric range with step increments.
- Use for measurement inputs where the unit is displayed separately.

## When Not to Use

- Do not use for phone numbers -- use TelInput instead.
- Do not use for codes or reference numbers -- use TextInput with `inputmode="numeric"` instead.
- Do not use for currency values -- use CurrencyInput instead.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label` for accessible naming, two-way bindable value, and optional `min`, `max`, and `step` constraints. The consumer provides all visual styling, including input dimensions, borders, spinner button appearance, and validation error display.


## Styles

The consumer provides all CSS styling. The component renders with a `.number-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `number-input`
- Verify aria-label={label}` -- provides an accessible name describing the purpose of the number input
- Verify pass-through attributes are applied

## Advice

- **Designers**: Clearly indicate the expected range and step size near the input (e.g., "Enter a value between 1 and 100") to reduce input errors.
- **Developers**: Set `min`, `max`, and `step` props to leverage browser-native validation. Be aware that `<input type="number">` returns an empty string for non-numeric input.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role (implicit): https://www.w3.org/TR/wai-aria-1.2/#spinbutton
