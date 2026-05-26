# SlovenijaEmsoView

## Metadata

- Component: slovenija-emso-view
- PascalCase: SlovenijaEmsoView
- Description: a read-only display of Slovenia's Enotna Matična Številka Občana (EMŠO)
- HTML tag: <span>
- CSS class: .slovenija-emso-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `slovenija-emso-view` and `role="text"`
- Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit
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

- [ ] Renders <span> element with class="slovenija-emso-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slovenija-emso-view in css-style-sheet-template.css
- Companion: SlovenijaEmsoInput
- Wikipedia: https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number
