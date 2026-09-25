# SingaporeNationalRegistrationIdentityCardInput

## Metadata

- Component: singapore-national-registration-identity-card-input
- PascalCase: SingaporeNationalRegistrationIdentityCardInput
- Description: an input for entering Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .singapore-national-registration-identity-card-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `singapore-national-registration-identity-card-input`
- Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.
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

- [x] Renders <input> element with class="singapore-national-registration-identity-card-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .singapore-national-registration-identity-card-input in css-style-sheet-template.css
- Companion: SingaporeNationalRegistrationIdentityCardView
- Wikipedia: [National Registration Identity Card](https://en.wikipedia.org/wiki/National_Registration_Identity_Card)
