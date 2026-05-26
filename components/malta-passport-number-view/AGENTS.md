# MaltaPassportNumberView

## Metadata

- Component: malta-passport-number-view
- PascalCase: MaltaPassportNumberView
- Description: a read-only display of Malta's Malta Passport Number
- HTML tag: <span>
- CSS class: .malta-passport-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `malta-passport-number-view` and `role="text"`
- Format: 7 numerical digits issued by the Civil Registration Directorate
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

- [ ] Renders <span> element with class="malta-passport-number-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .malta-passport-number-view in css-style-sheet-template.css
- Companion: MaltaPassportNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/Maltese_passport
