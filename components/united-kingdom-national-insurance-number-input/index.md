# United Kingdom National Insurance Number Input

UnitedKingdomNationalInsuranceNumberInput is a headless input for entering United Kingdom's National Insurance Number (NINO), United Kingdom's tax/welfare identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to UnitedKingdomNationalInsuranceNumberView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to UnitedKingdomNationalInsuranceNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="National Insurance Number" required>
  <UnitedKingdomNationalInsuranceNumberInput label="National Insurance Number" value={value} required />
  <Hint>two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A</Hint>
  <ErrorMessage>Please enter a valid National Insurance Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting United Kingdom's National Insurance Number (NINO).
- Use with pattern validation matching the documented format.
- Use in administrative or tax/welfare workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `united-kingdom-national-insurance-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.united-kingdom-national-insurance-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The National Insurance Number (NINO) is United Kingdom's tax/welfare identifier. Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.

## Related components

- `united-kingdom-national-insurance-number-view` — a read-only display of United Kingdom's National Insurance Number (NINO)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_Insurance_number

---

Lily™ and Lily Design System™ are trademarks.
