# MaltaNationalIdentificationNumberView

## Metadata

- Component: malta-national-identification-number-view
- PascalCase: MaltaNationalIdentificationNumberView
- Description: a read-only display of Malta's Malta National Identification Number
- HTML tag: <span>
- CSS class: .malta-national-identification-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `malta-national-identification-number-view` and `role="text"`
- Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era
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

- [ ] Renders <span> element with class="malta-national-identification-number-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .malta-national-identification-number-view in css-style-sheet-template.css
- Companion: MaltaNationalIdentificationNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Malta
