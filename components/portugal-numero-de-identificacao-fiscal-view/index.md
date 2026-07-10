# Portugal Numero De Identificacao Fiscal View

PortugalNumeroDeIdentificacaoFiscalView is a headless read-only display of Portugal's Número de Identificação Fiscal (NIF), Portugal's tax identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to PortugalNumeroDeIdentificacaoFiscalInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.)
- Provides accessible name via the `value` content
- Companion to PortugalNumeroDeIdentificacaoFiscalInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Tax Identification Number">
    <PortugalNumeroDeIdentificacaoFiscalView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Portugal Número de Identificação Fiscal (NIF) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `portugal-numero-de-identificacao-fiscal-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.portugal-numero-de-identificacao-fiscal-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Número de Identificação Fiscal (NIF) is Portugal's tax identifier. Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).

## Related components

- `portugal-numero-de-identificacao-fiscal-input` — an input for entering Portugal's Número de Identificação Fiscal (NIF)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

---

Lily™ and Lily Design System™ are trademarks.
