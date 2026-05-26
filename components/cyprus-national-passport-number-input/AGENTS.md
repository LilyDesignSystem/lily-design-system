# CyprusNationalPassportNumberInput

## Metadata

- Component: cyprus-national-passport-number-input
- PascalCase: CyprusNationalPassportNumberInput
- Description: an input for entering Cyprus's National Passport Number
- HTML tag: <input>
- CSS class: .cyprus-national-passport-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `cyprus-national-passport-number-input`
- Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678)
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

- [ ] Renders <input> element with class="cyprus-national-passport-number-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cyprus-national-passport-number-input in css-style-sheet-template.css
- Companion: CyprusNationalPassportNumberView
- Wikipedia: https://en.wikipedia.org/wiki/Cypriot_passport
