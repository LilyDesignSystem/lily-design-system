# Argentina Codigo Unico De Identificacion Laboral View

ArgentinaCodigoUnicoDeIdentificacionLaboralView is a headless read-only display of Argentina's Código Único de Identificación Laboral (CUIL), Argentina's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to ArgentinaCodigoUnicoDeIdentificacionLaboralInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.
- Provides accessible name via the `label` prop
- Companion to ArgentinaCodigoUnicoDeIdentificacionLaboralInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Código Único de Identificación Laboral (CUIL)">
    <ArgentinaCodigoUnicoDeIdentificacionLaboralView label="Código Único de Identificación Laboral (CUIL)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Argentina Código Único de Identificación Laboral (CUIL) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `argentina-codigo-unico-de-identificacion-laboral-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.argentina-codigo-unico-de-identificacion-laboral-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.

**Where to find it:** Printed on the CUIL confirmation letter issued by ANSES, and required to register with an obra social (health-insurance fund) and for all employment and pension records.

## Related components

- `argentina-codigo-unico-de-identificacion-laboral-input` — an input for entering Argentina's Código Único de Identificación Laboral (CUIL)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Código Único de Identificación Laboral](https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral)

---

Lily™ and Lily Design System™ are trademarks.
