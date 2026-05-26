# UnitedKingdomNationalHealthServiceNumberInput

## Metadata

- Component: united-kingdom-national-health-service-number-input
- PascalCase: UnitedKingdomNationalHealthServiceNumberInput
- Description: an input for entering a UK NHS number
- HTML tag: <input>
- CSS class: .united-kingdom-national-health-service-number-input
- Interactive: no

## Key Behaviors

- Renders as `<input type="text">` with pattern validation for NHS number format
- Pattern: `[0-9]{3} [0-9]{3} [0-9]{4}` (XXX XXX XXXX)
- `inputmode="numeric"` for numeric keyboard on mobile
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding
- Pattern is defined as a constant for validation

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `inputmode="numeric"` hints mobile assistive technology to present a numeric keyboard

## Keyboard

- Standard text input keyboard behavior
- Users type digits and spaces in the format XXX XXX XXXX

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="united-kingdom-national-health-service-number-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-kingdom-national-health-service-number-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/united-kingdom-national-health-service-number-input.html
- NHS Number format: https://www.nhs.uk/nhs-services/online-services/find-nhs-number/
