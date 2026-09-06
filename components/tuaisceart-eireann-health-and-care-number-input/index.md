# Tuaisceart Eireann Health And Care Number Input

TuaisceartEireannHealthAndCareNumberInput is a headless input for entering a Tuaisceart Eireann Health and Care (H&C) Number, the unique national healthcare identifier used by HSC Tuaisceart Eireann. It renders as `<input type="text">` with a 3-3-4 digit pattern, numeric keyboard hint, and autocomplete disabled. It is the editable companion to TuaisceartEireannHealthAndCareNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with pattern `[0-9]{3} [0-9]{3} [0-9]{4}`
- `inputmode="numeric"` for mobile numeric keyboard
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding on the `value` prop
- Companion to TuaisceartEireannHealthAndCareNumberView

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: any -- additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Health and Care Number" required>
  <TuaisceartEireannHealthAndCareNumberInput label="H&C Number" value={hcNumber} required />
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

- Use in clinical or administrative forms to collect a Tuaisceart Eireann Health and Care (H&C) Number.
- Use with validation for the 10-digit H&C Number format (XXX XXX XXXX).
- Use in patient registration workflows where the H&C Number is required by HSC Tuaisceart Eireann.

## When Not to Use

- Do not use for displaying read-only identifiers -- use TuaisceartEireannHealthAndCareNumberView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for UK NHS numbers -- use UnitedKingdomNationalHealthServiceNumberInput instead.

## Headless

This headless component provides a bare `<input type="text">` with `aria-label`, pattern, `inputmode="numeric"`, and `autocomplete="off"`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.tuaisceart-eireann-health-and-care-number-input` class for targeting.

## Testing

- Verify renders an `<input>` with the correct class and type="text"
- Verify `aria-label` is set from the label prop
- Verify pattern `[0-9]{3} [0-9]{3} [0-9]{4}`, `inputmode="numeric"`, `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten-digit identifier in the same 3-3-4 format as the NHS number, drawn from a reserved range (320 000 001 to 399 999 999) and used across Health and Social Care Tuaisceart Eireann (HSCNI). Because it shares the NHS number's ten-digit shape, it also shares its Modulus-11 check digit scheme.

**Where to find it:** HSCNI medical card, GP correspondence, hospital appointment letters, and prescriptions across Tuaisceart Eireann.

## Related components

- `tuaisceart-eireann-health-and-care-number-view` — a read-only display of Tuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier
- `text-input` — a single-line text input field <input type="text">

## References

- HSC NI: https://online.hscni.net/

---

Lily™ and Lily Design System™ are trademarks.
