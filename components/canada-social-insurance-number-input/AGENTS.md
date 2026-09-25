# CanadaSocialInsuranceNumberInput

## Metadata

- Component: canada-social-insurance-number-input
- PascalCase: CanadaSocialInsuranceNumberInput
- Description: an input for entering Canada's Social Insurance Number (SIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .canada-social-insurance-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `canada-social-insurance-number-input`
- Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="canada-social-insurance-number-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .canada-social-insurance-number-input in css-style-sheet-template.css
- Companion: CanadaSocialInsuranceNumberView
- Wikipedia: [Social Insurance Number](https://en.wikipedia.org/wiki/Social_Insurance_Number)
