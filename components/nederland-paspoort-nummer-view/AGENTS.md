# NederlandPaspoortNummerView

## Metadata

- Component: nederland-paspoort-nummer-view
- PascalCase: NederlandPaspoortNummerView
- Description: a read-only display of Netherlands's Paspoort Nummer
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .nederland-paspoort-nummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `nederland-paspoort-nummer-view`, and no role
- Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9]
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

- [ ] Renders <span> element with class="nederland-paspoort-nummer-view"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nederland-paspoort-nummer-view in css-style-sheet-template.css
- Companion: NederlandPaspoortNummerInput
- Wikipedia: https://en.wikipedia.org/wiki/Dutch_passport
