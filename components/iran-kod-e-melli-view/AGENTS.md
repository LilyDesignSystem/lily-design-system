# IranKodEMelliView

## Metadata

- Component: iran-kod-e-melli-view
- PascalCase: IranKodEMelliView
- Description: a read-only display of Iran's National Code (Kod-e Melli)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .iran-kod-e-melli-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `iran-kod-e-melli-view`
- Format: Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.
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

- [x] Renders <span> element with class="iran-kod-e-melli-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .iran-kod-e-melli-view in css-style-sheet-template.css
- Companion: IranKodEMelliInput
- Wikipedia: [Iranian identity card](https://en.wikipedia.org/wiki/Iranian_identity_card)
