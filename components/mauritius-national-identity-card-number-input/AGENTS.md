# MauritiusNationalIdentityCardNumberInput

## Metadata

- Component: mauritius-national-identity-card-number-input
- PascalCase: MauritiusNationalIdentityCardNumberInput
- Description: an input for entering Mauritius's National Identity Card number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .mauritius-national-identity-card-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `mauritius-national-identity-card-number-input`
- Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.
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

- [x] Renders <input> element with class="mauritius-national-identity-card-number-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .mauritius-national-identity-card-number-input in css-style-sheet-template.css
- Companion: MauritiusNationalIdentityCardNumberView
- [python-stdnum: stdnum.mu.nid](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid)
- [List of national identity card policies by country](https://en.wikipedia.org/wiki/List_of_national_identity_card_policies_by_country)
