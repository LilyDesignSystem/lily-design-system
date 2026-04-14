# France Numero D Identification Au Repertoire Input

FranceNumeroDIdentificationAuRepertoireInput is a headless input for entering a France numéro d'identification au répertoire (NIR), the unique national healthcare identifier. It renders as `<input type="text">` with pattern validation, numeric keyboard hint, and autocomplete disabled to protect sensitive health data. It is the editable companion to FranceNumeroDIdentificationAuRepertoireView.

The NIR is a 15-digit number printed on the Carte Vitale. The display format is `X XX XX XX XXX XXX XX` (sex, year, month, department, commune, order, control key).

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Pattern: X XX XX XX XXX XXX XX (15 digits with spaces)
- `inputmode="numeric"` for mobile numeric keyboard
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding on the `value` prop
- Companion to FranceNumeroDIdentificationAuRepertoireView

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: any -- additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Numéro de Sécurité Sociale" required>
  <FranceNumeroDIdentificationAuRepertoireInput label="NIR" value={nir} required />
  <Hint>Format: X XX XX XX XXX XXX XX (15 digits from your Carte Vitale)</Hint>
  <ErrorMessage>Please enter a valid NIR</ErrorMessage>
</Field>
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type digits and spaces in the format X XX XX XX XXX XXX XX

## ARIA

- `aria-label={label}` -- provides accessible name
- `inputmode="numeric"` hints mobile devices to show a numeric keyboard

## When to Use

- Use in clinical or administrative forms to collect a French NIR / Social Security number.
- Use with validation for the NIR identifier format (X XX XX XX XXX XXX XX).
- Use in patient registration workflows where the NIR is required for healthcare reimbursement in France.

## When Not to Use

- Do not use for displaying read-only identifiers -- use FranceNumeroDIdentificationAuRepertoireView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for other national identifiers -- use the corresponding country-specific input component.

## Headless

This headless component provides a bare `<input type="text">` with `aria-label`, pattern validation, and `inputmode="numeric"`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.france-numero-d-identification-au-repertoire-input` class for targeting.

## Testing

- Verify renders an `<input>` with the correct class and type="text"
- Verify `aria-label` is set from the label prop
- Verify pattern attribute matches NIR format
- Verify `inputmode="numeric"` and `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The French NIR (Numéro d'Inscription au Répertoire) is structured as 15 digits: position 1 is sex (1=male, 2=female), positions 2-3 are birth year, 4-5 birth month, 6-7 department code, 8-10 commune INSEE code, 11-13 order number, 14-15 control key (checksum 01-97). For people born abroad, the department code is 99 and the commune code is replaced by a 3-digit country code. Temporary numbers begin with 7 (male) or 8 (female). The number is printed on the Carte Vitale and used for all medical reimbursements.

## References

- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
