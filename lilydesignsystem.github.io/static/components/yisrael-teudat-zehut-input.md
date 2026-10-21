# Yisrael Teudat Zehut Input

YisraelTeudatZehutInput is a headless input for entering Israel's Teudat Zehut (תעודת זהות), Israel's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to YisraelTeudatZehutView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to YisraelTeudatZehutView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Teudat Zehut (תעודת זהות)" required>
  <YisraelTeudatZehutInput label="Teudat Zehut (תעודת זהות)" value={value} required />
  <Hint>Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.</Hint>
  <ErrorMessage>Please enter a valid Teudat Zehut</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Israel's Teudat Zehut (תעודת זהות).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `yisrael-teudat-zehut-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.yisrael-teudat-zehut-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.

**Where to find it:** Printed on the Teudat Zehut identity card and required to register with a Kupat Cholim (health fund) under Israel's National Health Insurance Law.

## Related components

- `yisrael-teudat-zehut-view` — a read-only display of Israel's Teudat Zehut (תעודת זהות)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Israeli identity card](https://en.wikipedia.org/wiki/Israeli_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
