# RomaniaPasaportView

## Metadata

- Component: romania-pasaport-view
- PascalCase: RomaniaPasaportView
- Description: a read-only display of Romania's Paşaport
- HTML tag: <span>
- CSS class: .romania-pasaport-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `romania-pasaport-view` and `role="text"`
- Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]
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

- [ ] Renders <span> element with class="romania-pasaport-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .romania-pasaport-view in css-style-sheet-template.css
- Companion: RomaniaPasaportInput
- Wikipedia: https://en.wikipedia.org/wiki/Romanian_passport
