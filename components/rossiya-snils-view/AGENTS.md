# RossiyaSnilsView

## Metadata

- Component: rossiya-snils-view
- PascalCase: RossiyaSnilsView
- Description: a read-only display of Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .rossiya-snils-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `rossiya-snils-view`
- Format: Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="rossiya-snils-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .rossiya-snils-view in css-style-sheet-template.css
- Companion: RossiyaSnilsInput
- Wikipedia: [SNILS (Russia)](<https://en.wikipedia.org/wiki/SNILS_(Russia)>)
