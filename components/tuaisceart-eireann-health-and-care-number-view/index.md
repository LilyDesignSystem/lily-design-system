# Tuaisceart Eireann Health And Care Number View

TuaisceartEireannHealthAndCareNumberView is a read-only display of a Tuaisceart Eireann Health and Care (H&C) Number, the unique national healthcare identifier. It renders the value as inline text inside a `<span>` with `aria-label`. It is the display-only companion to TuaisceartEireannHealthAndCareNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders a `<span>` with `aria-label`
- Displays the value as text content
- Companion to TuaisceartEireannHealthAndCareNumberInput

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- the H&C Number to display
- `...restProps`: any -- spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>Health and Care Number</dt>
    <dd><TuaisceartEireannHealthAndCareNumberView label="H&C Number" value="320 000 0001" /></dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None (passive display-only component)

## ARIA

- `aria-label={label}` -- provides accessible name

## When to Use

- Use to display a Tuaisceart Eireann Health and Care (H&C) Number in a formatted, read-only view.
- Use in patient banners, summary lists, or medical records to show the H&C Number.
- Use in confirmation screens after identifier entry.

## When Not to Use

- Do not use for entering identifiers -- use TuaisceartEireannHealthAndCareNumberInput instead.
- Do not use for editable display -- combine with Editable.
- Do not use for UK NHS numbers -- use UnitedKingdomNationalHealthServiceNumberView instead.

## Headless

This headless component provides a `<span>` with `aria-label`. Consumer provides all styling.

## Styles

Consumer provides all CSS. Class: `.tuaisceart-eireann-health-and-care-number-view`.

## Testing

- Verify renders `<span>` with correct class and aria-label
- Verify value displayed as text content

## Domain Knowledge

Ten-digit identifier in the same 3-3-4 format as the NHS number, drawn from a reserved range (320 000 001 to 399 999 999) and used across Health and Social Care Tuaisceart Eireann (HSCNI). Because it shares the NHS number's ten-digit shape, it also shares its Modulus-11 check digit scheme.

**Where to find it:** HSCNI medical card, GP correspondence, hospital appointment letters, and prescriptions across Tuaisceart Eireann.

## Related components

- `tuaisceart-eireann-health-and-care-number-input` — an input for entering aTuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier
- `espana-tarjeta-sanitaria-individual-input` — an input for entering an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- `espana-tarjeta-sanitaria-individual-view` — a read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- `france-numero-d-identification-au-repertoire-input` — an input for entering a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
- `france-numero-d-identification-au-repertoire-view` — a read-only display of a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
- `eire-individual-health-identifier-input` — an input for entering Eire Individual Health Identifier (IHI) unique national healthcare identifier

## References

- HSC NI: https://online.hscni.net/

---

Lily™ and Lily Design System™ are trademarks.
