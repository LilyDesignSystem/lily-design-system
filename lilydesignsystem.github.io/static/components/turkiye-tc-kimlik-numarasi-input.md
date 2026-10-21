# Turkiye Tc Kimlik Numarasi Input

TurkiyeTcKimlikNumarasiInput is a headless input for entering Turkey's T.C. Kimlik Numarası, Turkey's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to TurkiyeTcKimlikNumarasiView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to TurkiyeTcKimlikNumarasiView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="T.C. Kimlik Numarası" required>
  <TurkiyeTcKimlikNumarasiInput label="T.C. Kimlik Numarası" value={value} required />
  <Hint>Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.</Hint>
  <ErrorMessage>Please enter a valid T.C. Kimlik Numarası</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Turkey's T.C. Kimlik Numarası.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `turkiye-tc-kimlik-numarasi-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.turkiye-tc-kimlik-numarasi-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.

**Where to find it:** Printed on the Turkish national identity card (T.C. Kimlik Kartı) and required to register with SGK (Sosyal Güvenlik Kurumu), Turkey's Social Security Institution, for health coverage.

## Related components

- `turkiye-tc-kimlik-numarasi-view` — a read-only display of Turkey's T.C. Kimlik Numarası
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Turkish Identification Number](https://en.wikipedia.org/wiki/Turkish_Identification_Number)

---

Lily™ and Lily Design System™ are trademarks.
