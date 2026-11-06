# MaltaPassportNumberView

## Metadata

- Component: malta-passport-number-view
- PascalCase: MaltaPassportNumberView
- Description: a read-only display of Malta's Malta Passport Number
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .malta-passport-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `malta-passport-number-view` and `role="text"`
- Format: 7 numerical digits issued by the Civil Registration Directorate
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

- [ ] Renders <span> element with class="malta-passport-number-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .malta-passport-number-view in css-style-sheet-template.css
- Companion: MaltaPassportNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/Maltese_passport
