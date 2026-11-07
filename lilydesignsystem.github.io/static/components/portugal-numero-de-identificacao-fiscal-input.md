# Portugal Numero De Identificacao Fiscal Input

PortugalNumeroDeIdentificacaoFiscalInput is a headless input for entering Portugal's Número de Identificação Fiscal (NIF), Portugal's tax identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PortugalNumeroDeIdentificacaoFiscalView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

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
<Field
  label="Tax Identification Number"
  required
>
  <PortugalNumeroDeIdentificacaoFiscalInput
    label="Tax Identification Number"
    value="{value}"
    required
  />
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

Nine digits, the first eight sequential and the ninth a check digit. The leading digit encodes the entity type: 1–3 individuals; 45 non-residents earning Portuguese income subject to withholding; 5 resident legal entities; 6 public administration; 70/74/75 indivisible estates; 71 non-resident entities subject to definitive withholding; 72 investment funds; 77 NIFs allocated by the tax authority; 78 non-residents in the VAT refund scheme; 79 special cases; 8 sole traders (legacy); 90/91 condominiums, irregular societies, undivided inheritances; 98 non-residents without permanent establishment; 99 civil societies without legal personality.

**Where to find it:** Portuguese Cartão de Cidadão (which carries the NIF alongside the civil identification number), tax invoices, employer/contract documents, and the Portal das Finanças.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `portugal-numero-de-identificacao-fiscal-view` — a read-only display of Portugal's Número de Identificação Fiscal (NIF)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

---

Lily™ and Lily Design System™ are trademarks.
