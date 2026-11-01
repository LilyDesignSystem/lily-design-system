# HongKongIdentityCardInput

## Metadata

- Component: hong-kong-identity-card-input
- PascalCase: HongKongIdentityCardInput
- Description: an input for entering Hong Kong's Identity Card Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .hong-kong-identity-card-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `hong-kong-identity-card-input`
- Format: One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).
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

- [x] Renders <input> element with class="hong-kong-identity-card-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hong-kong-identity-card-input in css-style-sheet-template.css
- Companion: HongKongIdentityCardView
- Wikipedia: [Hong Kong identity card](https://en.wikipedia.org/wiki/Hong_Kong_identity_card)
