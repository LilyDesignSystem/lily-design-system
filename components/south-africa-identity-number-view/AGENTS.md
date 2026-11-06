# SouthAfricaIdentityNumberView

## Metadata

- Component: south-africa-identity-number-view
- PascalCase: SouthAfricaIdentityNumberView
- Description: a read-only display of South Africa's South African Identity Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .south-africa-identity-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `south-africa-identity-number-view`
- Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.
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

- [x] Renders <span> element with class="south-africa-identity-number-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .south-africa-identity-number-view in css-style-sheet-template.css
- Companion: SouthAfricaIdentityNumberInput
- Wikipedia: [South African identity card](https://en.wikipedia.org/wiki/South_African_identity_card)
