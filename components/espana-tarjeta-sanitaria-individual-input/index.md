# Espana Tarjeta Sanitaria Individual Input

EspanaTarjetaSanitariaIndividualInput is a headless input for entering a España Tarjeta Sanitaria Individual (TSI), the unique national healthcare identifier also known as CIP-SNS. It renders as `<input type="text">` with autocomplete disabled to protect sensitive health data. It is the editable companion to EspanaTarjetaSanitariaIndividualView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with `autocomplete="off"`
- Supports two-way binding on the `value` prop
- Companion to EspanaTarjetaSanitariaIndividualView

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: any -- additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Tarjeta Sanitaria Individual" required>
  <EspanaTarjetaSanitariaIndividualInput label="TSI" value={tsi} required />
  <Hint>Enter your CIP-SNS code from your health card</Hint>
  <ErrorMessage>Please enter a valid TSI number</ErrorMessage>
</Field>
```

## Keyboard Interactions

- Standard text input keyboard behavior

## ARIA

- `aria-label={label}` -- provides accessible name

## When to Use

- Use in clinical or administrative forms to collect a Spanish TSI / CIP-SNS healthcare identifier.
- Use with validation for the TSI identifier format.
- Use in patient registration workflows where the TSI is required for healthcare access in Spain.

## When Not to Use

- Do not use for displaying read-only identifiers -- use EspanaTarjetaSanitariaIndividualView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for other national identifiers -- use the corresponding country-specific input component.

## Headless

This headless component provides a bare `<input type="text">` with `aria-label` and `autocomplete="off"`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.espana-tarjeta-sanitaria-individual-input` class for targeting.

## Testing

- Verify renders an `<input>` with the correct class and type="text"
- Verify `aria-label` is set from the label prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Individual health card issued by the autonomous regional health administrations and INGESA, linked to the unique CIP-SNS code (Código de Identificación Personal del Sistema Nacional de Salud) and valid throughout Spain's National Health System. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Plastic Tarjeta Sanitaria Individual card issued by the regional health service, prescriptions, hospital identity bands, and the Mi Carpeta Ciudadana portal.

## Related components

- `espana-tarjeta-sanitaria-individual-view` — a read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- `text-input` — a single-line text input field <input type="text">

## References

- Ministerio de Sanidad: https://www.sanidad.gob.es/

---

Lily™ and Lily Design System™ are trademarks.
