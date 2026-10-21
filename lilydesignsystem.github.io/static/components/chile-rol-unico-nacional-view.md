# Chile Rol Unico Nacional View

ChileRolUnicoNacionalView is a headless read-only display of Chile's Rol Único Nacional (RUN), Chile's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to ChileRolUnicoNacionalInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.
- Provides accessible name via the `label` prop
- Companion to ChileRolUnicoNacionalInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Rol Único Nacional (RUN)">
    <ChileRolUnicoNacionalView label="Rol Único Nacional (RUN)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Chile Rol Único Nacional (RUN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `chile-rol-unico-nacional-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.chile-rol-unico-nacional-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.

**Where to find it:** Printed on the Cédula de Identidad national ID card and required to register with FONASA (Fondo Nacional de Salud), Chile's public health-insurance fund, or a private Isapre.

## Related components

- `chile-rol-unico-nacional-input` — an input for entering Chile's Rol Único Nacional (RUN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [RUT](https://en.wikipedia.org/wiki/RUT)

---

Lily™ and Lily Design System™ are trademarks.
