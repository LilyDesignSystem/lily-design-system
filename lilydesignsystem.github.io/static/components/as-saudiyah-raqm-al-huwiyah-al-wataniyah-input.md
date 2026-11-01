# As Saudiyah Raqm Al Huwiyah Al Wataniyah Input

AsSaudiyahRaqmAlHuwiyahAlWataniyahInput is a headless input for entering Saudi Arabia's National Identification Number, Saudi Arabia's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to AsSaudiyahRaqmAlHuwiyahAlWataniyahView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to AsSaudiyahRaqmAlHuwiyahAlWataniyahView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National Identification Number"
  required
>
  <AsSaudiyahRaqmAlHuwiyahAlWataniyahInput
    label="National Identification Number"
    value="{value}"
    required
  />
  <Hint
    >Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number),
    and the last digit is a check digit under the Luhn algorithm: counting from the right, every
    second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a
    multiple of 10.</Hint
  >
  <ErrorMessage>Please enter a valid National Identification Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Saudi Arabia's National Identification Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `as-saudiyah-raqm-al-huwiyah-al-wataniyah-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.as-saudiyah-raqm-al-huwiyah-al-wataniyah-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.

**Where to find it:** Printed on the National ID Card for citizens and on the iqama residence permit for residents, and used for Absher, Tawakkalna and health-service sign-in.

## Related components

- `as-saudiyah-raqm-al-huwiyah-al-wataniyah-view` — a read-only display of Saudi Arabia's National Identification Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [National identity card](https://en.wikipedia.org/wiki/National_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
