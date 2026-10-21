# Osterreich Sozialversicherungsnummer Input

OsterreichSozialversicherungsnummerInput is a headless input for entering Austria's Sozialversicherungsnummer (SVNR), Austria's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to OsterreichSozialversicherungsnummerView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to OsterreichSozialversicherungsnummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Sozialversicherungsnummer (SVNR)" required>
  <OsterreichSozialversicherungsnummerInput label="Sozialversicherungsnummer (SVNR)" value={value} required />
  <Hint>Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.</Hint>
  <ErrorMessage>Please enter a valid Sozialversicherungsnummer</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Austria's Sozialversicherungsnummer (SVNR).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `osterreich-sozialversicherungsnummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.osterreich-sozialversicherungsnummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.

**Where to find it:** Printed on the e-card (the Austrian health-insurance chip card) and required for every statutory health-insurance (Sozialversicherung), pension, and employment record.

## Related components

- `osterreich-sozialversicherungsnummer-view` — a read-only display of Austria's Sozialversicherungsnummer (SVNR)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Sozialversicherungsnummer](https://de.wikipedia.org/wiki/Sozialversicherungsnummer)

---

Lily™ and Lily Design System™ are trademarks.
