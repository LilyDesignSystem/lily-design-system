# SchweizAhvNummerView

## Metadata

- Component: schweiz-ahv-nummer-view
- PascalCase: SchweizAhvNummerView
- Description: a read-only display of Switzerland's AHV-Nummer / Numéro AVS
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .schweiz-ahv-nummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `schweiz-ahv-nummer-view`
- Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
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

- [x] Renders <span> element with class="schweiz-ahv-nummer-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .schweiz-ahv-nummer-view in css-style-sheet-template.css
- Companion: SchweizAhvNummerInput
- Wikipedia: [Data codes for Switzerland](https://en.wikipedia.org/wiki/Data_codes_for_Switzerland)
