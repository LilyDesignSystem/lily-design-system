# PolskaPeselView

## Metadata

- Component: polska-pesel-view
- PascalCase: PolskaPeselView
- Description: a read-only display of Poland's PESEL
- HTML tag: <span>
- CSS class: .polska-pesel-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `polska-pesel-view` and `role="text"`
- Format: 11 numeric digits; assigned shortly after birth and unchanged for life
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

- [ ] Renders <span> element with class="polska-pesel-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .polska-pesel-view in css-style-sheet-template.css
- Companion: PolskaPeselInput
- Wikipedia: https://en.wikipedia.org/wiki/PESEL
