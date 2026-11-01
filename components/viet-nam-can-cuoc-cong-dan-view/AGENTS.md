# VietNamCanCuocCongDanView

## Metadata

- Component: viet-nam-can-cuoc-cong-dan-view
- PascalCase: VietNamCanCuocCongDanView
- Description: a read-only display of Viet Nam's Citizen Identification Number (CCCD)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .viet-nam-can-cuoc-cong-dan-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `viet-nam-can-cuoc-cong-dan-view`
- Format: Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.
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

- [x] Renders <span> element with class="viet-nam-can-cuoc-cong-dan-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .viet-nam-can-cuoc-cong-dan-view in css-style-sheet-template.css
- Companion: VietNamCanCuocCongDanInput
- Wikipedia: [Vietnamese identity card](https://en.wikipedia.org/wiki/Vietnamese_identity_card)
