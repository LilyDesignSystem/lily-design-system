# HrvatskaOsobniIdentifikacijskiBrojView

## Metadata

- Component: hrvatska-osobni-identifikacijski-broj-view
- PascalCase: HrvatskaOsobniIdentifikacijskiBrojView
- Description: a read-only display of Croatia's Osobni identifikacijski broj (OIB)
- HTML tag: <span>
- CSS class: .hrvatska-osobni-identifikacijski-broj-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `hrvatska-osobni-identifikacijski-broj-view` and `role="text"`
- Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person
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

- [ ] Renders <span> element with class="hrvatska-osobni-identifikacijski-broj-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hrvatska-osobni-identifikacijski-broj-view in css-style-sheet-template.css
- Companion: HrvatskaOsobniIdentifikacijskiBrojInput
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)
