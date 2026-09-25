# OsterreichSozialversicherungsnummerView

## Metadata

- Component: osterreich-sozialversicherungsnummer-view
- PascalCase: OsterreichSozialversicherungsnummerView
- Description: a read-only display of Austria's Sozialversicherungsnummer (SVNR)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .osterreich-sozialversicherungsnummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `osterreich-sozialversicherungsnummer-view`
- Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
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

- [x] Renders <span> element with class="osterreich-sozialversicherungsnummer-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .osterreich-sozialversicherungsnummer-view in css-style-sheet-template.css
- Companion: OsterreichSozialversicherungsnummerInput
- Wikipedia: [Sozialversicherungsnummer](https://de.wikipedia.org/wiki/Sozialversicherungsnummer)
