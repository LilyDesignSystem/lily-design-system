# Northern Ireland Health And Care Number Input

NorthernIrelandHealthAndCareNumberInput is a headless input for entering a Northern Ireland Health and Care (H&C) Number, the unique national healthcare identifier used by HSC Northern Ireland. It renders as `<input type="text">` with a 3-3-4 digit pattern, numeric keyboard hint, and autocomplete disabled. It is the editable companion to NorthernIrelandHealthAndCareNumberView.

## Implementation Notes

- Renders as `<input type="text">` with pattern `[0-9]{3} [0-9]{3} [0-9]{4}`
- `inputmode="numeric"` for mobile numeric keyboard
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding on the `value` prop
- Companion to NorthernIrelandHealthAndCareNumberView

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: any -- additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Health and Care Number" required>
  <NorthernIrelandHealthAndCareNumberInput label="H&C Number" value={hcNumber} required />
  <Hint>Format: XXX XXX XXXX (10 digits from your H&C card)</Hint>
  <ErrorMessage>Please enter a valid H&C Number</ErrorMessage>
</Field>
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type digits and spaces in XXX XXX XXXX format

## ARIA

- `aria-label={label}` -- provides accessible name

## When to Use

- Use in clinical or administrative forms to collect a Northern Ireland Health and Care (H&C) Number.
- Use with validation for the 10-digit H&C Number format (XXX XXX XXXX).
- Use in patient registration workflows where the H&C Number is required by HSC Northern Ireland.

## When Not to Use

- Do not use for displaying read-only identifiers -- use NorthernIrelandHealthAndCareNumberView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for UK NHS numbers -- use UnitedKingdomNationalHealthServiceNumberInput instead.

## Headless

This headless component provides a bare `<input type="text">` with `aria-label`, pattern, `inputmode="numeric"`, and `autocomplete="off"`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.northern-ireland-health-and-care-number-input` class for targeting.

## Testing

- Verify renders an `<input>` with the correct class and type="text"
- Verify `aria-label` is set from the label prop
- Verify pattern `[0-9]{3} [0-9]{3} [0-9]{4}`, `inputmode="numeric"`, `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Northern Ireland Health and Care (H&C) Number is a 10-digit numeric identifier, often displayed in a 3-3-4 format (e.g. 320 000 0001). The first two digits are always between 32 and 39. It is the unique patient identifier used by Health and Social Care (HSC) services in Northern Ireland.

## References

- HSC NI: https://online.hscni.net/
