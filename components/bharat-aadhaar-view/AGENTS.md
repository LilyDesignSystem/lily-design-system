# BharatAadhaarView

## Metadata

- Component: bharat-aadhaar-view
- PascalCase: BharatAadhaarView
- Description: a read-only display of India's Aadhaar (आधार)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .bharat-aadhaar-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `bharat-aadhaar-view`
- Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible name via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="bharat-aadhaar-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .bharat-aadhaar-view in css-style-sheet-template.css
- Companion: BharatAadhaarInput
- Wikipedia: [Aadhaar](https://en.wikipedia.org/wiki/Aadhaar)
