# BharatAadhaarInput

## Metadata

- Component: bharat-aadhaar-input
- PascalCase: BharatAadhaarInput
- Description: an input for entering India's Aadhaar (आधार)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .bharat-aadhaar-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `bharat-aadhaar-input`
- Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
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

- [x] Renders <input> element with class="bharat-aadhaar-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .bharat-aadhaar-input in css-style-sheet-template.css
- Companion: BharatAadhaarView
- Wikipedia: [Aadhaar](https://en.wikipedia.org/wiki/Aadhaar)
