# Schweiz Ahv Nummer Input

SchweizAhvNummerInput is a headless input for entering Switzerland's AHV-Nummer / Numéro AVS, Switzerland's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to SchweizAhvNummerView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to SchweizAhvNummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="AHV-Nummer / Numéro AVS" required>
  <SchweizAhvNummerInput label="AHV-Nummer / Numéro AVS" value={value} required />
  <Hint>Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.</Hint>
  <ErrorMessage>Please enter a valid AHV-Nummer / Numéro AVS</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Switzerland's AHV-Nummer / Numéro AVS.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `schweiz-ahv-nummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.schweiz-ahv-nummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.

**Where to find it:** Printed on the Swiss health-insurance card (carte d'assuré / Versichertenkarte), the AHV/AVS card, and payslips.

## Related components

- `schweiz-ahv-nummer-view` — a read-only display of Switzerland's AHV-Nummer / Numéro AVS
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Data codes for Switzerland](https://en.wikipedia.org/wiki/Data_codes_for_Switzerland)

---

Lily™ and Lily Design System™ are trademarks.
