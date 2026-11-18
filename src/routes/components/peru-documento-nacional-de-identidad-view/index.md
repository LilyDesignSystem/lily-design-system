# Peru Documento Nacional De Identidad View

PeruDocumentoNacionalDeIdentidadView is a headless read-only display of Peru's Documento Nacional de Identidad (DNI), Peru's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to PeruDocumentoNacionalDeIdentidadInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.
- Provides accessible name via the `label` prop
- Companion to PeruDocumentoNacionalDeIdentidadInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Documento Nacional de Identidad (DNI)">
    <PeruDocumentoNacionalDeIdentidadView
      label="Documento Nacional de Identidad (DNI)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Documento Nacional de Identidad (DNI) from Peru read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `peru-documento-nacional-de-identidad-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.peru-documento-nacional-de-identidad-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.

**Where to find it:** Printed on the front of the DNI card issued by RENIEC, and asked for in almost every dealing with the state, a bank or a health service.

## Related components

- `peru-documento-nacional-de-identidad-input` — an input for entering Peru's Documento Nacional de Identidad (DNI)
- `summary-list-item` — one key-value pair in a summary list

## References

- [Documento Nacional de Identidad (Perú)](<https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)>)
- [python-stdnum: stdnum.pe.cui](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.pe.cui)

---

Lily™ and Lily Design System™ are trademarks.
