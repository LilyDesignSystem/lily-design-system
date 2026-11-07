# LietuvaPasasView

## Metadata

- Component: lietuva-pasas-view
- PascalCase: LietuvaPasasView
- Description: a read-only display of Lithuania's Pasas
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .lietuva-pasas-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `lietuva-pasas-view`, and no role
- Format: 8-digit passport or identity card number
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="lietuva-pasas-view"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .lietuva-pasas-view in css-style-sheet-template.css
- Companion: LietuvaPasasInput
- Wikipedia: https://en.wikipedia.org/wiki/Lithuanian_passport
