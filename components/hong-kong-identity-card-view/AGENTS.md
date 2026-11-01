# HongKongIdentityCardView

## Metadata

- Component: hong-kong-identity-card-view
- PascalCase: HongKongIdentityCardView
- Description: a read-only display of Hong Kong's Identity Card Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .hong-kong-identity-card-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `hong-kong-identity-card-view`
- Format: One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).
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

- [x] Renders <span> element with class="hong-kong-identity-card-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hong-kong-identity-card-view in css-style-sheet-template.css
- Companion: HongKongIdentityCardInput
- Wikipedia: [Hong Kong identity card](https://en.wikipedia.org/wiki/Hong_Kong_identity_card)
