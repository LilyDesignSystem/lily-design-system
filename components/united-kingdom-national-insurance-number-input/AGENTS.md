# UnitedKingdomNationalInsuranceNumberInput

## Metadata

- Component: united-kingdom-national-insurance-number-input
- PascalCase: UnitedKingdomNationalInsuranceNumberInput
- Description: an input for entering United Kingdom's National Insurance Number (NINO)
- HTML tag: <input>
- CSS class: .united-kingdom-national-insurance-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `united-kingdom-national-insurance-number-input`
- Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded
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

- [ ] Renders <input> element with class="united-kingdom-national-insurance-number-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-kingdom-national-insurance-number-input in css-style-sheet-template.css
- Companion: UnitedKingdomNationalInsuranceNumberView
- Wikipedia: https://en.wikipedia.org/wiki/National_Insurance_number
