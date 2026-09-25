# SingaporeNationalRegistrationIdentityCardView

## Metadata

- Component: singapore-national-registration-identity-card-view
- PascalCase: SingaporeNationalRegistrationIdentityCardView
- Description: a read-only display of Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .singapore-national-registration-identity-card-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `singapore-national-registration-identity-card-view`
- Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.
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

- [x] Renders <span> element with class="singapore-national-registration-identity-card-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .singapore-national-registration-identity-card-view in css-style-sheet-template.css
- Companion: SingaporeNationalRegistrationIdentityCardInput
- Wikipedia: [National Registration Identity Card](https://en.wikipedia.org/wiki/National_Registration_Identity_Card)
