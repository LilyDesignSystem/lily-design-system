# SriLankaNationalIdentityCardInput

## Metadata

- Component: sri-lanka-national-identity-card-input
- PascalCase: SriLankaNationalIdentityCardInput
- Description: an input for entering Sri Lanka's National Identity Card (NIC) number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .sri-lanka-national-identity-card-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `sri-lanka-national-identity-card-input`
- Format: Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="sri-lanka-national-identity-card-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .sri-lanka-national-identity-card-input in css-style-sheet-template.css
- Companion: SriLankaNationalIdentityCardView
- [National identity card (Sri Lanka)](<https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)>)
