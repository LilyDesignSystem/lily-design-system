# Espana Codigo De Identificacion Fiscal View

EspanaCodigoDeIdentificacionFiscalView is a headless read-only display of Spain's Código de Identificación Fiscal (CIF), Spain's tax identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to EspanaCodigoDeIdentificacionFiscalInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)
- Provides accessible name via the `value` content
- Companion to EspanaCodigoDeIdentificacionFiscalInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Tax Identification Code">
    <EspanaCodigoDeIdentificacionFiscalView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Spain Código de Identificación Fiscal (CIF) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `espana-codigo-de-identificacion-fiscal-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.espana-codigo-de-identificacion-fiscal-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Código de Identificación Fiscal (CIF) is Spain's tax identifier. Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).

## Related components

- `espana-codigo-de-identificacion-fiscal-input` — an input for entering Spain's Código de Identificación Fiscal (CIF)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/VAT_identification_number#Spain
