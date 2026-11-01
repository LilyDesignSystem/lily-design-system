# Ecuador Cedula De Identidad View

EcuadorCedulaDeIdentidadView is a headless read-only display of Ecuador's Cedula de Identidad Number, Ecuador's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to EcuadorCedulaDeIdentidadInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.
- Provides accessible name via the `label` prop
- Companion to EcuadorCedulaDeIdentidadInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Cedula de Identidad Number">
    <EcuadorCedulaDeIdentidadView
      label="Cedula de Identidad Number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Ecuador Cedula de Identidad Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `ecuador-cedula-de-identidad-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ecuador-cedula-de-identidad-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.

**Where to find it:** Printed on the Cédula de Identidad issued by the Registro Civil, and asked for by the IESS social-security institute, banks and government services.

## Related components

- `ecuador-cedula-de-identidad-input` — an input for entering Ecuador's Cedula de Identidad Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)

---

Lily™ and Lily Design System™ are trademarks.
