# Brasil Cartao Nacional De Saude View

BrasilCartaoNacionalDeSaudeView is a headless read-only display of Brazil's Cartão Nacional de Saúde (CNS), Brazil's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to BrasilCartaoNacionalDeSaudeInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
- Provides accessible name via the `label` prop
- Companion to BrasilCartaoNacionalDeSaudeInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Cartão Nacional de Saúde (CNS)">
    <BrasilCartaoNacionalDeSaudeView label="Cartão Nacional de Saúde (CNS)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Brazil Cartão Nacional de Saúde (CNS) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `brasil-cartao-nacional-de-saude-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.brasil-cartao-nacional-de-saude-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.

**Where to find it:** Printed on the Cartão SUS (physical or digital health card) and required for any public health-system appointment, prescription, or vaccination record in Brazil.

## Related components

- `brasil-cartao-nacional-de-saude-input` — an input for entering Brazil's Cartão Nacional de Saúde (CNS)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [CPF number (Cartão Nacional de Saúde)](https://en.wikipedia.org/wiki/CPF_number)

---

Lily™ and Lily Design System™ are trademarks.
