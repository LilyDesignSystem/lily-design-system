# LatvijaPersonasKodsView

## Metadata

- Component: latvija-personas-kods-view
- PascalCase: LatvijaPersonasKodsView
- Description: a read-only display of Latvia's Personas kods
- HTML tag: <span>
- CSS class: .latvija-personas-kods-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `latvija-personas-kods-view` and `role="text"`
- Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)
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

- [ ] Renders <span> element with class="latvija-personas-kods-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .latvija-personas-kods-view in css-style-sheet-template.css
- Companion: LatvijaPersonasKodsInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Latvia
