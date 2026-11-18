# Guatemala Codigo Unico De Identificacion View

GuatemalaCodigoUnicoDeIdentificacionView is a headless read-only display of Guatemala's Código Único de Identificación (CUI), Guatemala's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to GuatemalaCodigoUnicoDeIdentificacionInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.
- Provides accessible name via the `label` prop
- Companion to GuatemalaCodigoUnicoDeIdentificacionInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Código Único de Identificación (CUI)">
    <GuatemalaCodigoUnicoDeIdentificacionView
      label="Código Único de Identificación (CUI)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Código Único de Identificación (CUI) from Guatemala read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `guatemala-codigo-unico-de-identificacion-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.guatemala-codigo-unico-de-identificacion-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.

**Where to find it:** Printed on the front of the Documento Personal de Identificación (DPI) issued by RENAP, and given at birth registration.

## Related components

- `guatemala-codigo-unico-de-identificacion-input` — an input for entering Guatemala's Código Único de Identificación (CUI)
- `summary-list-item` — one key-value pair in a summary list

## References

- [RENAP: ¿Qué es el CUI?](https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf)
- [Documento Personal de Identificación](https://es.wikipedia.org/wiki/Documento_Personal_de_Identificaci%C3%B3n)

---

Lily™ and Lily Design System™ are trademarks.
