# FranceNumeroDIdentificationAuRepertoireView

A display component for showing a France numéro d'identification au répertoire (NIR) in a read-only format. The NIR is a 15-digit identifier that uniquely identifies individuals registered with the French national healthcare system (Assurance Maladie), printed on the Carte Vitale.

This component renders the NIR as an inline `<span>` element with an accessible label, making it suitable for use in patient records, summaries, confirmation screens, or any context where a NIR needs to be displayed but not edited. The accessible label ensures screen readers can announce the purpose of the displayed number.

## Implementation Notes

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the NIR value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the NIR string to display

## Usage

```vue
<FranceNumeroDIdentificationAuRepertoireView label="NIR" value="1 85 05 75 012 345 67" />
```

```vue
<FranceNumeroDIdentificationAuRepertoireView label="Numéro de sécurité sociale" :value="nir" />
```

## Keyboard Interactions

- None -- this is a passive display-only component

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Screen readers announce the label followed by the text content (the number value)

## References

- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
