# Taiwan Guomin Shenfenzheng Tongyi Bianhao Input

TaiwanGuominShenfenzhengTongyiBianhaoInput is a headless input for entering Taiwan's National Identification Card Number, Taiwan's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to TaiwanGuominShenfenzhengTongyiBianhaoView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to TaiwanGuominShenfenzhengTongyiBianhaoView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National Identification Card Number"
  required
>
  <TaiwanGuominShenfenzhengTongyiBianhaoInput
    label="National Identification Card Number"
    value="{value}"
    required
  />
  <Hint
    >One uppercase letter for the household-registration office, then nine digits. The first digit
    is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit
    is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the
    official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by
    the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.</Hint
  >
  <ErrorMessage>Please enter a valid National Identification Card Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Taiwan's National Identification Card Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `taiwan-guomin-shenfenzheng-tongyi-bianhao-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.taiwan-guomin-shenfenzheng-tongyi-bianhao-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.

**Where to find it:** Printed on the National Identification Card (國民身分證) and used for National Health Insurance, banking, tax filing and household registration.

## Related components

- `taiwan-guomin-shenfenzheng-tongyi-bianhao-view` — a read-only display of Taiwan's National Identification Card Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [National identification card (Taiwan)](<https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)>)

---

Lily™ and Lily Design System™ are trademarks.
