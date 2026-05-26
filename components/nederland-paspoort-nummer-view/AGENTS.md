# NederlandPaspoortNummerView

## Metadata

- Component: nederland-paspoort-nummer-view
- PascalCase: NederlandPaspoortNummerView
- Description: a read-only display of Netherlands's Paspoort Nummer
- HTML tag: <span>
- CSS class: .nederland-paspoort-nummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `nederland-paspoort-nummer-view` and `role="text"`
- Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9]
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

- [ ] Renders <span> element with class="nederland-paspoort-nummer-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nederland-paspoort-nummer-view in css-style-sheet-template.css
- Companion: NederlandPaspoortNummerInput
- Wikipedia: https://en.wikipedia.org/wiki/Dutch_passport
