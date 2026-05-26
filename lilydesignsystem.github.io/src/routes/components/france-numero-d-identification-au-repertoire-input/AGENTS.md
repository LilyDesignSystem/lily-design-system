# FranceNumeroDIdentificationAuRepertoireInput

## Metadata

- Component: france-numero-d-identification-au-repertoire-input
- PascalCase: FranceNumeroDIdentificationAuRepertoireInput
- Description: an input for entering a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
- HTML tag: <input>
- CSS class: .france-numero-d-identification-au-repertoire-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with pattern validation for NIR format
- Pattern: `[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}` (X XX XX XX XXX XXX XX)
- `inputmode="numeric"` for numeric keyboard on mobile
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `inputmode="numeric"` hints mobile assistive technology to present a numeric keyboard

## Keyboard

- Standard text input keyboard behavior
- Users type digits and spaces in the format X XX XX XX XXX XXX XX

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="france-numero-d-identification-au-repertoire-input"
- [ ] Has aria-label attribute
- [ ] Has pattern validation for NIR format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .france-numero-d-identification-au-repertoire-input in css-style-sheet-template.css
- Companion: FranceNumeroDIdentificationAuRepertoireView
- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
