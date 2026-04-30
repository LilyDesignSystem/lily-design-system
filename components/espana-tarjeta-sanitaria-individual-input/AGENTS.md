# EspanaTarjetaSanitariaIndividualInput

## Metadata

- Component: espana-tarjeta-sanitaria-individual-input
- PascalCase: EspanaTarjetaSanitariaIndividualInput
- Description: an input for entering an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- HTML tag: <input>
- CSS class: .espana-tarjeta-sanitaria-individual-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` for entering a TSI/CIP-SNS identifier
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="espana-tarjeta-sanitaria-individual-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- Companion: EspanaTarjetaSanitariaIndividualView
