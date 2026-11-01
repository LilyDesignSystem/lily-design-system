# Hong Kong Identity Card Input

HongKongIdentityCardInput is a headless input for entering Hong Kong's Identity Card Number, Hong Kong's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to HongKongIdentityCardView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to HongKongIdentityCardView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Hong Kong Identity Card Number"
  required
>
  <HongKongIdentityCardInput
    label="Hong Kong Identity Card Number"
    value="{value}"
    required
  />
  <Hint
    >One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check
    digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a
    space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the
    check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when
    the result is 10).</Hint
  >
  <ErrorMessage>Please enter a valid Hong Kong Identity Card Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Hong Kong's Identity Card Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `hong-kong-identity-card-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.hong-kong-identity-card-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).

**Where to find it:** Printed on the Hong Kong Identity Card, and asked for by hospitals, clinics, banks, employers and government services.

## Related components

- `hong-kong-identity-card-view` — a read-only display of Hong Kong's Identity Card Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Hong Kong identity card](https://en.wikipedia.org/wiki/Hong_Kong_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
