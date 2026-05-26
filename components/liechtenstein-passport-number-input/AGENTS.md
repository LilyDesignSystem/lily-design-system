# LiechtensteinPassportNumberInput

## Metadata

- Component: liechtenstein-passport-number-input
- PascalCase: LiechtensteinPassportNumberInput
- Description: an input for entering Liechtenstein's Liechtenstein Passport Number
- HTML tag: <input>
- CSS class: .liechtenstein-passport-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `liechtenstein-passport-number-input`
- Format: 1 letter followed by 5 digits (e.g. R00536)
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

- [ ] Renders <input> element with class="liechtenstein-passport-number-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .liechtenstein-passport-number-input in css-style-sheet-template.css
- Companion: LiechtensteinPassportNumberView
- Wikipedia: https://en.wikipedia.org/wiki/Liechtenstein_passport
