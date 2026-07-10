# Portugal Numero De Identificacao Fiscal Input

PortugalNumeroDeIdentificacaoFiscalInput is a headless input for entering Portugal's Número de Identificação Fiscal (NIF), Portugal's tax identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PortugalNumeroDeIdentificacaoFiscalView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to PortugalNumeroDeIdentificacaoFiscalView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Tax Identification Number" required>
  <PortugalNumeroDeIdentificacaoFiscalInput label="Tax Identification Number" value={value} required />
  <Hint>9 digits</Hint>
  <ErrorMessage>Please enter a valid Tax Identification Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Portugal's Número de Identificação Fiscal (NIF).
- Use with pattern validation matching the documented format.
- Use in administrative or tax workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `portugal-numero-de-identificacao-fiscal-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.portugal-numero-de-identificacao-fiscal-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Número de Identificação Fiscal (NIF) is Portugal's tax identifier. Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).

## Related components

- `portugal-numero-de-identificacao-fiscal-view` — a read-only display of Portugal's Número de Identificação Fiscal (NIF)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

---

Lily™ and Lily Design System™ are trademarks.
