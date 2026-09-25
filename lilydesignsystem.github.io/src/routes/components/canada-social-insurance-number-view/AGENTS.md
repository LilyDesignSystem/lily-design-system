# CanadaSocialInsuranceNumberView

## Metadata

- Component: canada-social-insurance-number-view
- PascalCase: CanadaSocialInsuranceNumberView
- Description: a read-only display of Canada's Social Insurance Number (SIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .canada-social-insurance-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `canada-social-insurance-number-view`
- Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.
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

- [x] Renders <span> element with class="canada-social-insurance-number-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .canada-social-insurance-number-view in css-style-sheet-template.css
- Companion: CanadaSocialInsuranceNumberInput
- Wikipedia: [Social Insurance Number](https://en.wikipedia.org/wiki/Social_Insurance_Number)
