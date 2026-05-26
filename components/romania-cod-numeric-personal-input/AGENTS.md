# RomaniaCodNumericPersonalInput

## Metadata

- Component: romania-cod-numeric-personal-input
- PascalCase: RomaniaCodNumericPersonalInput
- Description: an input for entering Romania's Cod Numeric Personal (CNP)
- HTML tag: <input>
- CSS class: .romania-cod-numeric-personal-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `romania-cod-numeric-personal-input`
- Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit
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

- [ ] Renders <input> element with class="romania-cod-numeric-personal-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .romania-cod-numeric-personal-input in css-style-sheet-template.css
- Companion: RomaniaCodNumericPersonalView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Romania
