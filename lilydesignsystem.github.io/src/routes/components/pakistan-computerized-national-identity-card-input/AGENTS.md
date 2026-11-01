# PakistanComputerizedNationalIdentityCardInput

## Metadata

- Component: pakistan-computerized-national-identity-card-input
- PascalCase: PakistanComputerizedNationalIdentityCardInput
- Description: an input for entering Pakistan's Computerized National Identity Card Number (CNIC)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .pakistan-computerized-national-identity-card-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `pakistan-computerized-national-identity-card-input`
- Format: Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.
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

- [x] Renders <input> element with class="pakistan-computerized-national-identity-card-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pakistan-computerized-national-identity-card-input in css-style-sheet-template.css
- Companion: PakistanComputerizedNationalIdentityCardView
- Wikipedia: [Computerized National Identity Card](https://en.wikipedia.org/wiki/Computerized_National_Identity_Card)
