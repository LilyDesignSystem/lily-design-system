# LiechtensteinNationalIdentityCardNumberView

## Metadata

- Component: liechtenstein-national-identity-card-number-view
- PascalCase: LiechtensteinNationalIdentityCardNumberView
- Description: a read-only display of Liechtenstein's Liechtenstein National Identity Card Number
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .liechtenstein-national-identity-card-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `liechtenstein-national-identity-card-number-view`, and no role
- Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="liechtenstein-national-identity-card-number-view"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .liechtenstein-national-identity-card-number-view in css-style-sheet-template.css
- Companion: LiechtensteinNationalIdentityCardNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identity_card
