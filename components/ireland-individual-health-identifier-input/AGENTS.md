# IrelandIndividualHealthIdentifierInput

## Metadata

- Component: ireland-individual-health-identifier-input
- PascalCase: IrelandIndividualHealthIdentifierInput
- Description: an input for entering Ireland Individual Health Identifier (IHI) unique national healthcare identifier
- HTML tag: <input>
- CSS class: .ireland-individual-health-identifier-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with pattern validation for IHI format
- Pattern: `[0-9]{10}` (10 digits)
- `inputmode="numeric"` for numeric keyboard on mobile
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

- [ ] Renders <input> element with class="ireland-individual-health-identifier-input"
- [ ] Has aria-label, pattern, inputmode="numeric", autocomplete="off"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- Companion: IrelandIndividualHealthIdentifierView
