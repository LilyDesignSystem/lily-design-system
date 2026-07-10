# Cyprus National Passport Number Input

CyprusNationalPassportNumberInput is a headless input for entering Cyprus's National Passport Number, Cyprus's passport identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to CyprusNationalPassportNumberView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to CyprusNationalPassportNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="National Passport Number" required>
  <CyprusNationalPassportNumberInput label="National Passport Number" value={value} required />
  <Hint>passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456)</Hint>
  <ErrorMessage>Please enter a valid National Passport Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Cyprus's National Passport Number.
- Use with pattern validation matching the documented format.
- Use in administrative or passport workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `cyprus-national-passport-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cyprus-national-passport-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The National Passport Number is Cyprus's passport identifier. Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678).

## Related components

- `cyprus-national-passport-number-view` — a read-only display of Cyprus's National Passport Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Cypriot_passport

---

Lily™ and Lily Design System™ are trademarks.
