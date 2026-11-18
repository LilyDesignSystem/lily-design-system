# SriLankaNationalIdentityCardView

## Metadata

- Component: sri-lanka-national-identity-card-view
- PascalCase: SriLankaNationalIdentityCardView
- Description: a read-only display of Sri Lanka's National Identity Card (NIC) number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .sri-lanka-national-identity-card-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `sri-lanka-national-identity-card-view`
- Format: Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.
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

- [x] Renders <span> element with class="sri-lanka-national-identity-card-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .sri-lanka-national-identity-card-view in css-style-sheet-template.css
- Companion: SriLankaNationalIdentityCardInput
- [National identity card (Sri Lanka)](<https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)>)
