# Viet Nam Can Cuoc Cong Dan Input

VietNamCanCuocCongDanInput is a headless input for entering Viet Nam's Citizen Identification Number (CCCD), Viet Nam's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to VietNamCanCuocCongDanView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to VietNamCanCuocCongDanView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Citizen Identification Number (CCCD)"
  required
>
  <VietNamCanCuocCongDanInput
    label="Citizen Identification Number (CCCD)"
    value="{value}"
    required
  />
  <Hint
    >Twelve digits: a three-digit code for the province or country of registration, one digit for
    gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the
    2000s, and so on in pairs), the last two digits of the year of birth, and six random digits.
    There is no published check digit.</Hint
  >
  <ErrorMessage>Please enter a valid Citizen Identification Number (CCCD)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Viet Nam's Citizen Identification Number (CCCD).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `viet-nam-can-cuoc-cong-dan-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.viet-nam-can-cuoc-cong-dan-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.

**Where to find it:** Printed on the Citizen Identity Card (Căn cước công dân), and used for health insurance, banking, tax and government services.

## Related components

- `viet-nam-can-cuoc-cong-dan-view` — a read-only display of Viet Nam's Citizen Identification Number (CCCD)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Vietnamese identity card](https://en.wikipedia.org/wiki/Vietnamese_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
