# BangladeshNationalIdentityCardView

## Metadata

- Component: bangladesh-national-identity-card-view
- PascalCase: BangladeshNationalIdentityCardView
- Description: a read-only display of Bangladesh's National ID (NID) number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .bangladesh-national-identity-card-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `bangladesh-national-identity-card-view`
- Format: Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.
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

- [x] Renders <span> element with class="bangladesh-national-identity-card-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .bangladesh-national-identity-card-view in css-style-sheet-template.css
- Companion: BangladeshNationalIdentityCardInput
- [National identity card (Bangladesh)](<https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)>)
- [bdnews24: EC decides on 10-digit smart NID cards](https://bdnews24.com/bangladesh/election-commission-decides-on-10-digit-smart-nid-cards-for-bangladesh-nationals)
