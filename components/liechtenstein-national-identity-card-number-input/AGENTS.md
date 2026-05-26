# LiechtensteinNationalIdentityCardNumberInput

## Metadata

- Component: liechtenstein-national-identity-card-number-input
- PascalCase: LiechtensteinNationalIdentityCardNumberInput
- Description: an input for entering Liechtenstein's Liechtenstein National Identity Card Number
- HTML tag: <input>
- CSS class: .liechtenstein-national-identity-card-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `liechtenstein-national-identity-card-number-input`
- Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card
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

- [ ] Renders <input> element with class="liechtenstein-national-identity-card-number-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .liechtenstein-national-identity-card-number-input in css-style-sheet-template.css
- Companion: LiechtensteinNationalIdentityCardNumberView
- Wikipedia: https://en.wikipedia.org/wiki/National_identity_card
