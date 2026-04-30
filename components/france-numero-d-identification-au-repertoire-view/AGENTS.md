# FranceNumeroDIdentificationAuRepertoireView

## Metadata

- Component: france-numero-d-identification-au-repertoire-view
- PascalCase: FranceNumeroDIdentificationAuRepertoireView
- Description: a read-only display of a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
- HTML tag: <span>
- CSS class: .france-numero-d-identification-au-repertoire-view
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the NIR value as inline text content
- Read-only display component; pairs with FranceNumeroDIdentificationAuRepertoireInput for editing
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number

## Keyboard

- None -- this is a passive display-only component

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the NIR string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="france-numero-d-identification-au-repertoire-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .france-numero-d-identification-au-repertoire-view in css-style-sheet-template.css
- Companion: FranceNumeroDIdentificationAuRepertoireInput
- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
