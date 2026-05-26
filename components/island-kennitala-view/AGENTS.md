# IslandKennitalaView

## Metadata

- Component: island-kennitala-view
- PascalCase: IslandKennitalaView
- Description: a read-only display of Iceland's Kennitala
- HTML tag: <span>
- CSS class: .island-kennitala-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `island-kennitala-view` and `role="text"`
- Format: 10 digits where the first 6 are the date of birth (DDMMYY)
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

- [ ] Renders <span> element with class="island-kennitala-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .island-kennitala-view in css-style-sheet-template.css
- Companion: IslandKennitalaInput
- Wikipedia: https://en.wikipedia.org/wiki/Kennitala
