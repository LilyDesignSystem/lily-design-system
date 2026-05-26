# CyprusNationalPassportNumberView

## Metadata

- Component: cyprus-national-passport-number-view
- PascalCase: CyprusNationalPassportNumberView
- Description: a read-only display of Cyprus's National Passport Number
- HTML tag: <span>
- CSS class: .cyprus-national-passport-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `cyprus-national-passport-number-view` and `role="text"`
- Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678)
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

- [ ] Renders <span> element with class="cyprus-national-passport-number-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cyprus-national-passport-number-view in css-style-sheet-template.css
- Companion: CyprusNationalPassportNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/Cypriot_passport
