# Mexico Clave Unica De Registro De Poblacion View

MexicoClaveUnicaDeRegistroDePoblacionView is a headless read-only display of Mexico's Clave Única de Registro de Población (CURP), Mexico's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to MexicoClaveUnicaDeRegistroDePoblacionInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
- Provides accessible name via the `label` prop
- Companion to MexicoClaveUnicaDeRegistroDePoblacionInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Clave Única de Registro de Población (CURP)">
    <MexicoClaveUnicaDeRegistroDePoblacionView label="Clave Única de Registro de Población (CURP)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Mexico Clave Única de Registro de Población (CURP) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `mexico-clave-unica-de-registro-de-poblacion-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.mexico-clave-unica-de-registro-de-poblacion-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.

**Where to find it:** Printed on the CURP certificate issued by RENAPO, and on Mexican identity documents including the INE voter card and (for minors) birth certificates.

## Related components

- `mexico-clave-unica-de-registro-de-poblacion-input` — an input for entering Mexico's Clave Única de Registro de Población (CURP)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Unique Population Registry Code](https://en.wikipedia.org/wiki/Unique_Population_Registry_Code)

---

Lily™ and Lily Design System™ are trademarks.
