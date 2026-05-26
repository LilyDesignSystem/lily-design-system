# EnglandNationalHealthServiceNumberInput

## Metadata

- Component: england-national-health-service-number-input
- PascalCase: EnglandNationalHealthServiceNumberInput
- Description: an input for entering England's National Health Service Number (NHS)
- HTML tag: <input>
- CSS class: .england-national-health-service-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `england-national-health-service-number-input`
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `aria-label` provided from the `label` prop

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <input> element with class="england-national-health-service-number-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .england-national-health-service-number-input in css-style-sheet-template.css
- Companion: EnglandNationalHealthServiceNumberView
- Wikipedia: https://en.wikipedia.org/wiki/NHS_number
