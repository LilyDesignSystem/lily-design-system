# Colombia Cedula De Ciudadania View

ColombiaCedulaDeCiudadaniaView is a headless read-only display of Colombia's Cedula de Ciudadania Number, Colombia's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to ColombiaCedulaDeCiudadaniaInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.
- Provides accessible name via the `label` prop
- Companion to ColombiaCedulaDeCiudadaniaInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Cedula de Ciudadania Number">
    <ColombiaCedulaDeCiudadaniaView
      label="Cedula de Ciudadania Number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Colombia Cedula de Ciudadania Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `colombia-cedula-de-ciudadania-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.colombia-cedula-de-ciudadania-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.

**Where to find it:** Printed on the Cédula de Ciudadanía issued by the Registraduría Nacional del Estado Civil, and asked for by EPS health-insurance providers, banks and government services.

## Related components

- `colombia-cedula-de-ciudadania-input` — an input for entering Colombia's Cedula de Ciudadania Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Colombian identity card](https://en.wikipedia.org/wiki/Colombian_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
