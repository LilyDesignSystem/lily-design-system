# TurkiyeTcKimlikNumarasiView

## Metadata

- Component: turkiye-tc-kimlik-numarasi-view
- PascalCase: TurkiyeTcKimlikNumarasiView
- Description: a read-only display of Turkey's T.C. Kimlik Numarası
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .turkiye-tc-kimlik-numarasi-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `turkiye-tc-kimlik-numarasi-view`
- Format: Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.
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

- [x] Renders <span> element with class="turkiye-tc-kimlik-numarasi-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .turkiye-tc-kimlik-numarasi-view in css-style-sheet-template.css
- Companion: TurkiyeTcKimlikNumarasiInput
- Wikipedia: [Turkish Identification Number](https://en.wikipedia.org/wiki/Turkish_Identification_Number)
