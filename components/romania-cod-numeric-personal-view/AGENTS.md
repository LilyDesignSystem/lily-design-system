# RomaniaCodNumericPersonalView

## Metadata

- Component: romania-cod-numeric-personal-view
- PascalCase: RomaniaCodNumericPersonalView
- Description: a read-only display of Romania's Cod Numeric Personal (CNP)
- HTML tag: <span>
- CSS class: .romania-cod-numeric-personal-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `romania-cod-numeric-personal-view` and `role="text"`
- Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit
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

- [ ] Renders <span> element with class="romania-cod-numeric-personal-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .romania-cod-numeric-personal-view in css-style-sheet-template.css
- Companion: RomaniaCodNumericPersonalInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Romania
