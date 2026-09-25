# Rossiya Snils Input

RossiyaSnilsInput is a headless input for entering Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta), Russia's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to RossiyaSnilsView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to RossiyaSnilsView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)" required>
  <RossiyaSnilsInput label="СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)" value={value} required />
  <Hint>Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.</Hint>
  <ErrorMessage>Please enter a valid СНИЛС</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `rossiya-snils-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.rossiya-snils-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.

**Where to find it:** Printed on the SNILS card (green laminated card or, since 2019, a digital record) issued by the Pension Fund of Russia, and required for compulsory medical insurance (ОМС) enrolment, employment, and pension records.

## Related components

- `rossiya-snils-view` — a read-only display of Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [SNILS (Russia)](https://en.wikipedia.org/wiki/SNILS_(Russia))

---

Lily™ and Lily Design System™ are trademarks.
