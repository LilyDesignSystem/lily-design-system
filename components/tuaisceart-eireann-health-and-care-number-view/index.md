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

The Tuaisceart Eireann Health and Care (H&C) Number is a 10-digit numeric identifier, often displayed in a 3-3-4 format (e.g. 320 000 0001). The first two digits are always between 32 and 39.

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
