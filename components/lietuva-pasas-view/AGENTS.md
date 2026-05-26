# LietuvaPasasView

## Metadata

- Component: lietuva-pasas-view
- PascalCase: LietuvaPasasView
- Description: a read-only display of Lithuania's Pasas
- HTML tag: <span>
- CSS class: .lietuva-pasas-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `lietuva-pasas-view` and `role="text"`
- Format: 8-digit passport or identity card number
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

- [ ] Renders <span> element with class="lietuva-pasas-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .lietuva-pasas-view in css-style-sheet-template.css
- Companion: LietuvaPasasInput
- Wikipedia: https://en.wikipedia.org/wiki/Lithuanian_passport
