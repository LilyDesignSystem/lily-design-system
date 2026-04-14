# France Numero D Identification Au Repertoire View

FranceNumeroDIdentificationAuRepertoireView is a read-only display of a France numéro d'identification au répertoire (NIR), the unique national healthcare identifier. It renders the value as inline text inside a `<span>` with `aria-label` for accessibility. It is the display-only companion to FranceNumeroDIdentificationAuRepertoireInput.

The NIR (also known as the Social Security number) is a 15-digit number printed on the Carte Vitale. It consists of a 13-digit base (sex, birth year, birth month, department, commune, order number) and a 2-digit control key.

## Implementation Notes

- Renders a `<span>` with `aria-label`
- Displays the value as text content
- No formatting or validation; consumer provides the value pre-formatted
- Companion to FranceNumeroDIdentificationAuRepertoireInput for the Input/View pattern

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- the NIR string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>Numéro de Sécurité Sociale</dt>
    <dd><FranceNumeroDIdentificationAuRepertoireView label="NIR" value="1 85 05 75 012 345 67" /></dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None (passive display-only component)

## ARIA

- `aria-label={label}` -- provides accessible name for the displayed number

## When to Use

- Use to display a French NIR / Social Security number in a formatted, read-only view.
- Use in patient banners, summary lists, or medical records to show the NIR.
- Use in confirmation screens after identifier entry.

## When Not to Use

- Do not use for entering identifiers -- use FranceNumeroDIdentificationAuRepertoireInput instead.
- Do not use for editable display -- combine with Editable.
- Do not use for other national identifiers -- use the corresponding country-specific view component.

## Headless

This headless component provides a `<span>` with `aria-label`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.france-numero-d-identification-au-repertoire-view` class for targeting.

## Testing

- Verify renders a `<span>` with the correct class
- Verify `aria-label` is set from the label prop
- Verify value is displayed as text content
- Verify pass-through attributes are applied

## Domain Knowledge

The French NIR (Numéro d'Inscription au Répertoire) is structured as 15 digits: position 1 is sex (1=male, 2=female), positions 2-3 are birth year, 4-5 birth month, 6-7 department code, 8-10 commune INSEE code, 11-13 order number, 14-15 control key (checksum 01-97). For people born abroad, the department code is 99 and the commune code is replaced by a 3-digit country code. Temporary numbers begin with 7 (male) or 8 (female).

## References

- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
