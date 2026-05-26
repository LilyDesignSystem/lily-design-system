# MaltaPassportNumberInput

## Metadata

- Component: malta-passport-number-input
- PascalCase: MaltaPassportNumberInput
- Description: an input for entering Malta's Malta Passport Number
- HTML tag: <input>
- CSS class: .malta-passport-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `malta-passport-number-input`
- Format: 7 numerical digits issued by the Civil Registration Directorate
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

- [ ] Renders <input> element with class="malta-passport-number-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .malta-passport-number-input in css-style-sheet-template.css
- Companion: MaltaPassportNumberView
- Wikipedia: https://en.wikipedia.org/wiki/Maltese_passport
