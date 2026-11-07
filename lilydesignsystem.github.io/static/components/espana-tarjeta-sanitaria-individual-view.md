# Espana Tarjeta Sanitaria Individual View

EspanaTarjetaSanitariaIndividualView is a read-only display of a España Tarjeta Sanitaria Individual (TSI), the unique national healthcare identifier also known as CIP-SNS (Código de Identificación Personal del Sistema Nacional de Salud). It renders the value as inline text inside a `<span>` with `aria-label` for accessibility. It is the display-only companion to EspanaTarjetaSanitariaIndividualInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Displays the value as text content
- No formatting or validation; consumer provides the value pre-formatted
- Companion to EspanaTarjetaSanitariaIndividualInput for the Input/View pattern

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: "") -- the TSI string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>Tarjeta Sanitaria Individual</dt>
    <dd>
      <EspanaTarjetaSanitariaIndividualView
        label="TSI"
        value="BBBB12345678"
      />
    </dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None (passive display-only component)

## ARIA

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
- Verify `label` renders as hidden text, and that the root has no `aria-label`
- Verify value is displayed as text content

## Domain Knowledge

Individual health card issued by the autonomous regional health administrations and INGESA, linked to the unique CIP-SNS code (Código de Identificación Personal del Sistema Nacional de Salud) and valid throughout Spain's National Health System. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Plastic Tarjeta Sanitaria Individual card issued by the regional health service, prescriptions, hospital identity bands, and the Mi Carpeta Ciudadana portal.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

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
