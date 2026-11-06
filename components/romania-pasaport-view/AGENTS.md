# RomaniaPasaportView

## Metadata

- Component: romania-pasaport-view
- PascalCase: RomaniaPasaportView
- Description: a read-only display of Romania's Paşaport
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .romania-pasaport-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `romania-pasaport-view`, and no role
- Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]
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

- [ ] Renders <span> element with class="romania-pasaport-view"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .romania-pasaport-view in css-style-sheet-template.css
- Companion: RomaniaPasaportInput
- Wikipedia: https://en.wikipedia.org/wiki/Romanian_passport
