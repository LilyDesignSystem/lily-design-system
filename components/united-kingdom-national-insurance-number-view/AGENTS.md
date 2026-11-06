# UnitedKingdomNationalInsuranceNumberView

## Metadata

- Component: united-kingdom-national-insurance-number-view
- PascalCase: UnitedKingdomNationalInsuranceNumberView
- Description: a read-only display of United Kingdom's National Insurance Number (NINO)
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .united-kingdom-national-insurance-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `united-kingdom-national-insurance-number-view` and `role="text"`
- Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text
- `role="text"` so the identifier announces as a single unit

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="united-kingdom-national-insurance-number-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-kingdom-national-insurance-number-view in css-style-sheet-template.css
- Companion: UnitedKingdomNationalInsuranceNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/National_Insurance_number
