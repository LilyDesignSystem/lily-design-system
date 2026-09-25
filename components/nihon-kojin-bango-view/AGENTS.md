# NihonKojinBangoView

## Metadata

- Component: nihon-kojin-bango-view
- PascalCase: NihonKojinBangoView
- Description: a read-only display of Japan's Individual Number / My Number (マイナンバー)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .nihon-kojin-bango-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `nihon-kojin-bango-view`
- Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
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

- [x] Renders <span> element with class="nihon-kojin-bango-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nihon-kojin-bango-view in css-style-sheet-template.css
- Companion: NihonKojinBangoInput
- Wikipedia: [Individual Number](https://en.wikipedia.org/wiki/Individual_Number)
