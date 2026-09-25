# Nihon Kojin Bango Input

NihonKojinBangoInput is a headless input for entering Japan's Individual Number / My Number (マイナンバー), Japan's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to NihonKojinBangoView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to NihonKojinBangoView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Individual Number / My Number (マイナンバー)" required>
  <NihonKojinBangoInput label="Individual Number / My Number (マイナンバー)" value={value} required />
  <Hint>Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).</Hint>
  <ErrorMessage>Please enter a valid Individual Number / My Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Japan's Individual Number / My Number (マイナンバー).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `nihon-kojin-bango-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nihon-kojin-bango-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).

**Where to find it:** Printed on the Individual Number Card (マイナンバーカード) and the paper Notification Card, and required when enrolling in Japan's National Health Insurance (国民健康保険).

## Related components

- `nihon-kojin-bango-view` — a read-only display of Japan's Individual Number / My Number (マイナンバー)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Individual Number](https://en.wikipedia.org/wiki/Individual_Number)

---

Lily™ and Lily Design System™ are trademarks.
