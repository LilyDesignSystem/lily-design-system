# Espana Tarjeta Sanitaria Individual View

EspanaTarjetaSanitariaIndividualView is a read-only display of a España Tarjeta Sanitaria Individual (TSI), the unique national healthcare identifier also known as CIP-SNS (Código de Identificación Personal del Sistema Nacional de Salud). It renders the value as inline text inside a `<span>` with `aria-label` for accessibility. It is the display-only companion to EspanaTarjetaSanitariaIndividualInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders a `<span>` with `aria-label`
- Displays the value as text content
- No formatting or validation; consumer provides the value pre-formatted
- Companion to EspanaTarjetaSanitariaIndividualInput for the Input/View pattern

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- the TSI string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>Tarjeta Sanitaria Individual</dt>
    <dd><EspanaTarjetaSanitariaIndividualView label="TSI" value="BBBB12345678" /></dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None (passive display-only component)

## ARIA

- `aria-label={label}` -- provides accessible name for the displayed identifier

## When to Use

- Use to display a Spanish TSI / CIP-SNS healthcare identifier in a formatted, read-only view.
- Use in patient banners, summary lists, or medical records to show the TSI.
- Use in confirmation screens after identifier entry.

## When Not to Use

- Do not use for entering identifiers -- use EspanaTarjetaSanitariaIndividualInput instead.
- Do not use for editable display -- combine with Editable.
- Do not use for other national identifiers -- use the corresponding country-specific view component.

## Headless

This headless component provides a `<span>` with `aria-label`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.espana-tarjeta-sanitaria-individual-view` class for targeting.

## Testing

- Verify renders a `<span>` with the correct class
- Verify `aria-label` is set from the label prop
- Verify value is displayed as text content

## Domain Knowledge

Individual health card issued by the autonomous regional health administrations and INGESA, linked to the unique CIP-SNS code (Código de Identificación Personal del Sistema Nacional de Salud) and valid throughout Spain's National Health System. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Plastic Tarjeta Sanitaria Individual card issued by the regional health service, prescriptions, hospital identity bands, and the Mi Carpeta Ciudadana portal.

## Related components

- `espana-tarjeta-sanitaria-individual-input` — an input for entering an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- `france-numero-d-identification-au-repertoire-input` — an input for entering a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
- `france-numero-d-identification-au-repertoire-view` — a read-only display of a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
- `eire-individual-health-identifier-input` — an input for entering Eire Individual Health Identifier (IHI) unique national healthcare identifier
- `eire-individual-health-identifier-view` — a read-only display of Eire Individual Health Identifier (IHI) unique national healthcare identifier
- `tuaisceart-eireann-health-and-care-number-input` — an input for entering aTuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier

## References

- Ministerio de Sanidad: https://www.sanidad.gob.es/

---

Lily™ and Lily Design System™ are trademarks.
