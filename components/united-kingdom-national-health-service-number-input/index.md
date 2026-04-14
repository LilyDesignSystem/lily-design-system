# United Kingdom National Health Service Number Input

A United Kingdom National Health Service (NHS) number input is a specialized
form field for entering a 10-digit NHS patient identifier. The NHS number is
assigned to every patient registered with the National Health Service in
England, Wales, and the Isle of Man, and is used to uniquely identify
individuals across the health system.

The standard display format is "XXX XXX XXXX" (three groups of digits separated
by spaces). This input component enforces that pattern, uses a numeric keyboard
hint for mobile devices, and disables autocomplete to protect sensitive health
information. The component supports required and disabled states, and provides
accessible labeling for screen readers.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation for NHS number format
- Pattern: `[0-9]{3} [0-9]{3} [0-9]{4}` (XXX XXX XXXX)
- `inputmode="numeric"` for numeric keyboard on mobile
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding
- Pattern is defined as a constant for validation

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="NHS Number" required>
  <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" value={nhsNumber} required />
  <Hint>Format: XXX XXX XXXX (10 digits from your NHS records)</Hint>
  <ErrorMessage>Please enter a valid NHS number</ErrorMessage>
</Field>
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type digits and spaces in the format XXX XXX XXXX

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `inputmode="numeric"` hints mobile assistive technology to present a numeric keyboard

## When to Use

- Use in clinical or administrative forms to collect a UK NHS patient identifier in the standard XXX XXX XXXX format.
- Use with validation for the 10-digit NHS number format.
- Use in patient registration forms, healthcare applications, or any system that processes NHS numbers.
- Use when pattern validation and numeric keyboard hints are needed for the NHS number format.

## When Not to Use

- Do not use for displaying read-only identifiers -- use UnitedKingdomNationalHealthServiceNumberView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for Northern Ireland H&C numbers -- use NorthernIrelandHealthAndCareNumberInput instead.

## Headless

This headless component provides an `<input type="text">` with NHS number pattern validation, `inputmode="numeric"`, `autocomplete="off"`, `aria-label`, and support for `required`/`disabled` states. The consumer provides all visual styling, surrounding labels, hints, and error messages.


## Styles

The consumer provides all CSS styling. The component renders with a `.united-kingdom-national-health-service-number-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `united-kingdom-national-health-service-number-input`
- Verify aria-label` provides accessible name from label prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display a format hint (e.g., "XXX XXX XXXX") near the input to help users enter the number correctly. Use error messaging for invalid formats.
- **Developers**: The component enforces the pattern `[0-9]{3} [0-9]{3} [0-9]{4}` on form submission. Consider adding real-time formatting or a checksum validation for the NHS number's modulus 11 algorithm.

## Composition

UnitedKingdomNationalHealthServiceNumberInput is the editable input counterpart to UnitedKingdomNationalHealthServiceNumberView, following the Input/View pattern. Use the Input for data entry and the View for read-only display.

## References

- NHS Number format: https://www.nhs.uk/nhs-services/online-services/find-nhs-number/
