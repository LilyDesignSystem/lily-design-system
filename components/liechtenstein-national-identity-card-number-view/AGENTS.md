# LiechtensteinNationalIdentityCardNumberView

## Metadata

- Component: liechtenstein-national-identity-card-number-view
- PascalCase: LiechtensteinNationalIdentityCardNumberView
- Description: a read-only display of Liechtenstein's Liechtenstein National Identity Card Number
- HTML tag: <span>
- CSS class: .liechtenstein-national-identity-card-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `liechtenstein-national-identity-card-number-view` and `role="text"`
- Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop
- `role="text"` so the identifier announces as a single unit

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible name override via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="liechtenstein-national-identity-card-number-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .liechtenstein-national-identity-card-number-view in css-style-sheet-template.css
- Companion: LiechtensteinNationalIdentityCardNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identity_card
