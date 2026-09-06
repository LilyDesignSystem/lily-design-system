# Espana Codigo De Identificacion Fiscal Input

EspanaCodigoDeIdentificacionFiscalInput is a headless input for entering Spain's Código de Identificación Fiscal (CIF), Spain's tax identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to EspanaCodigoDeIdentificacionFiscalView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to EspanaCodigoDeIdentificacionFiscalView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Tax Identification Code" required>
  <EspanaCodigoDeIdentificacionFiscalInput label="Tax Identification Code" value={value} required />
  <Hint>9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)</Hint>
  <ErrorMessage>Please enter a valid Tax Identification Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Spain's Código de Identificación Fiscal (CIF).
- Use with pattern validation matching the documented format.
- Use in administrative or tax workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `espana-codigo-de-identificacion-fiscal-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.espana-codigo-de-identificacion-fiscal-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Nine characters: eight digits plus a control letter (the letters I, Ñ, O, and U are not used). Example: 99111222M. For Spanish citizens the NIF equals the DNI; foreign residents use the NIE (leading letter X, Y, or Z). Since 2008 the CIF form is reserved for legal entities, while NIF designates natural persons. The control letter is computed with a Modulo 23 algorithm: the 8-digit number modulo 23 indexes into the fixed 23-character table "TRWAGMYFPDXBNJZSQVHLCKE" (e.g. 12345678 mod 23 = 14 → "Z"); for a NIE the leading letter is first mapped to a digit (X→0, Y→1, Z→2) before the same calculation.

**Where to find it:** Spanish national identity card (DNI), the residence card (NIE) for foreign residents, the driving licence, and the social security card.

## Related components

- `espana-codigo-de-identificacion-fiscal-view` — a read-only display of Spain's Código de Identificación Fiscal (CIF)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/VAT_identification_number#Spain

---

Lily™ and Lily Design System™ are trademarks.
