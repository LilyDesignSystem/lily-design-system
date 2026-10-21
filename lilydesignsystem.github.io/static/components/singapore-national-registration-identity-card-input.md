# Singapore National Registration Identity Card Input

SingaporeNationalRegistrationIdentityCardInput is a headless input for entering Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN), Singapore's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to SingaporeNationalRegistrationIdentityCardView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to SingaporeNationalRegistrationIdentityCardView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" required>
  <SingaporeNationalRegistrationIdentityCardInput label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value={value} required />
  <Hint>One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.</Hint>
  <ErrorMessage>Please enter a valid National Registration Identity Card Number / Foreign Identification Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `singapore-national-registration-identity-card-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.singapore-national-registration-identity-card-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.

**Where to find it:** Printed on the pink (citizen), blue (permanent resident), or FIN-series NRIC/employment/work-pass card, and required to enrol in Singapore's MediSave/MediShield Life national health schemes.

## Related components

- `singapore-national-registration-identity-card-view` — a read-only display of Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [National Registration Identity Card](https://en.wikipedia.org/wiki/National_Registration_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
