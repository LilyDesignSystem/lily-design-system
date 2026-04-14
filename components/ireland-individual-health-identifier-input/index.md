# Ireland Individual Health Identifier Input

IrelandIndividualHealthIdentifierInput is a headless input for entering an Ireland Individual Health Identifier (IHI), the unique national healthcare identifier used by the HSE. It renders as `<input type="text">` with a 10-digit pattern, numeric keyboard hint, and autocomplete disabled. It is the editable companion to IrelandIndividualHealthIdentifierView.

## Implementation Notes

- Renders as `<input type="text">` with pattern `[0-9]{10}`
- `inputmode="numeric"` for mobile numeric keyboard
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding on the `value` prop
- Companion to IrelandIndividualHealthIdentifierView

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: any -- additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Individual Health Identifier" required>
  <IrelandIndividualHealthIdentifierInput label="IHI" value={ihi} required />
  <Hint>Enter the 10-digit IHI from your HSE records</Hint>
  <ErrorMessage>Please enter a valid 10-digit IHI</ErrorMessage>
</Field>
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type 10 digits

## ARIA

- `aria-label={label}` -- provides accessible name

## When to Use

- Use in clinical or administrative forms to collect an Ireland Individual Health Identifier (IHI).
- Use with validation for the 10-digit IHI format.
- Use in patient registration workflows where the IHI is required by HSE systems.

## When Not to Use

- Do not use for displaying read-only identifiers -- use IrelandIndividualHealthIdentifierView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for other national identifiers -- use the corresponding country-specific input component.

## Headless

This headless component provides a bare `<input type="text">` with `aria-label`, pattern, `inputmode="numeric"`, and `autocomplete="off"`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.ireland-individual-health-identifier-input` class for targeting.

## Testing

- Verify renders an `<input>` with the correct class and type="text"
- Verify `aria-label` is set from the label prop
- Verify pattern `[0-9]{10}`, `inputmode="numeric"`, `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Ireland Individual Health Identifier (IHI) is a 10-digit clinical identifier used by healthcare providers to safely match patients with their medical records across different hospitals and GPs. Unlike the Ireland Personal Public Service Number (PPSN), the IHI contains no personal information and is not used for social welfare or taxes. It is primarily used behind the scenes by the Health Service Executive (HSE).

## References

- HSE: https://www.hse.ie/
