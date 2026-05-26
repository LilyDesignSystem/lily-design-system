# SlovenijaEmsoInput

## Metadata

- Component: slovenija-emso-input
- PascalCase: SlovenijaEmsoInput
- Description: an input for entering Slovenia's Enotna Matična Številka Občana (EMŠO)
- HTML tag: <input>
- CSS class: .slovenija-emso-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `slovenija-emso-input`
- Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit
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

- [ ] Renders <input> element with class="slovenija-emso-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slovenija-emso-input in css-style-sheet-template.css
- Companion: SlovenijaEmsoView
- Wikipedia: https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number
