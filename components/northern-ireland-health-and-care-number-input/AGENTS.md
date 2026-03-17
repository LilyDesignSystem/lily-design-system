# Northern Ireland Health And Care Number Input

## Metadata

- Component: northern-ireland-health-and-care-number-input
- PascalCase: NorthernIrelandHealthAndCareNumberInput
- Description: an input for entering a Northern Ireland Health and Care (H&C) Number unique national healthcare identifier
- HTML tag: <input>
- CSS class: .northern-ireland-health-and-care-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with pattern validation for H&C Number format
- Pattern: `[0-9]{3} [0-9]{3} [0-9]{4}` (XXX XXX XXXX)
- `inputmode="numeric"` for numeric keyboard on mobile
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior
- Users type digits and spaces in format XXX XXX XXXX

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="northern-ireland-health-and-care-number-input"
- [ ] Has aria-label, pattern, inputmode="numeric", autocomplete="off"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- Companion: NorthernIrelandHealthAndCareNumberView
