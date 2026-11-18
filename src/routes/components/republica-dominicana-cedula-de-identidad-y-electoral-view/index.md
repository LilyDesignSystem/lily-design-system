# Republica Dominicana Cedula De Identidad Y Electoral View

RepublicaDominicanaCedulaDeIdentidadYElectoralView is a headless read-only display of the Dominican Republic's Cédula de Identidad y Electoral, the Dominican Republic's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to RepublicaDominicanaCedulaDeIdentidadYElectoralInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.
- Provides accessible name via the `label` prop
- Companion to RepublicaDominicanaCedulaDeIdentidadYElectoralInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Cédula de Identidad y Electoral">
    <RepublicaDominicanaCedulaDeIdentidadYElectoralView
      label="Cédula de Identidad y Electoral"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Cédula de Identidad y Electoral from the Dominican Republic read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `republica-dominicana-cedula-de-identidad-y-electoral-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.republica-dominicana-cedula-de-identidad-y-electoral-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.

**Where to find it:** Printed on the cédula issued by the Junta Central Electoral, and used to vote, to open a bank account and as the personal tax number.

## Related components

- `republica-dominicana-cedula-de-identidad-y-electoral-input` — an input for entering the Dominican Republic's Cédula de Identidad y Electoral
- `summary-list-item` — one key-value pair in a summary list

## References

- [Junta Central Electoral (República Dominicana)](<https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)>)
- [python-stdnum: stdnum.do.cedula](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.do.cedula)

---

Lily™ and Lily Design System™ are trademarks.
