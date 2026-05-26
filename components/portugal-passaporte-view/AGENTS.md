# PortugalPassaporteView

## Metadata

- Component: portugal-passaporte-view
- PascalCase: PortugalPassaporteView
- Description: a read-only display of Portugal's Passaporte
- HTML tag: <span>
- CSS class: .portugal-passaporte-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `portugal-passaporte-view` and `role="text"`
- Format: 1 letter [A-Z] and 6 digits [0-9]
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

- [ ] Renders <span> element with class="portugal-passaporte-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .portugal-passaporte-view in css-style-sheet-template.css
- Companion: PortugalPassaporteInput
- Wikipedia: https://en.wikipedia.org/wiki/Portuguese_passport
