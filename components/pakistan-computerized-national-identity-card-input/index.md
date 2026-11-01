# Pakistan Computerized National Identity Card Input

PakistanComputerizedNationalIdentityCardInput is a headless input for entering Pakistan's Computerized National Identity Card Number (CNIC), Pakistan's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PakistanComputerizedNationalIdentityCardView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to PakistanComputerizedNationalIdentityCardView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Computerized National Identity Card Number (CNIC)"
  required
>
  <PakistanComputerizedNationalIdentityCardInput
    label="Computerized National Identity Card Number (CNIC)"
    value="{value}"
    required
  />
  <Hint
    >Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division,
    district and tehsil), a seven-digit family number, and a final digit that is odd for a male and
    even for a female. There is no check digit.</Hint
  >
  <ErrorMessage
    >Please enter a valid Computerized National Identity Card Number (CNIC)</ErrorMessage
  >
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Pakistan's Computerized National Identity Card Number (CNIC).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `pakistan-computerized-national-identity-card-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.pakistan-computerized-national-identity-card-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.

**Where to find it:** Printed on the Computerized National Identity Card (CNIC) issued by NADRA, and asked for by hospitals, banks, schools and government services.

## Related components

- `pakistan-computerized-national-identity-card-view` — a read-only display of Pakistan's Computerized National Identity Card Number (CNIC)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Computerized National Identity Card](https://en.wikipedia.org/wiki/Computerized_National_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
