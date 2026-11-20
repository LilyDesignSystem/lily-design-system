# BangladeshNationalIdentityCardInput

## Metadata

- Component: bangladesh-national-identity-card-input
- PascalCase: BangladeshNationalIdentityCardInput
- Description: an input for entering Bangladesh's National ID (NID) number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .bangladesh-national-identity-card-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `bangladesh-national-identity-card-input`
- Format: Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.
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

- [x] Renders <input> element with class="bangladesh-national-identity-card-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .bangladesh-national-identity-card-input in css-style-sheet-template.css
- Companion: BangladeshNationalIdentityCardView
- [National identity card (Bangladesh)](<https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)>)
- [bdnews24: EC decides on 10-digit smart NID cards](https://bdnews24.com/bangladesh/election-commission-decides-on-10-digit-smart-nid-cards-for-bangladesh-nationals)
