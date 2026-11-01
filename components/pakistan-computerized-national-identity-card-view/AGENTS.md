# PakistanComputerizedNationalIdentityCardView

## Metadata

- Component: pakistan-computerized-national-identity-card-view
- PascalCase: PakistanComputerizedNationalIdentityCardView
- Description: a read-only display of Pakistan's Computerized National Identity Card Number (CNIC)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .pakistan-computerized-national-identity-card-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `pakistan-computerized-national-identity-card-view`
- Format: Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.
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

- [x] Renders <span> element with class="pakistan-computerized-national-identity-card-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pakistan-computerized-national-identity-card-view in css-style-sheet-template.css
- Companion: PakistanComputerizedNationalIdentityCardInput
- Wikipedia: [Computerized National Identity Card](https://en.wikipedia.org/wiki/Computerized_National_Identity_Card)
