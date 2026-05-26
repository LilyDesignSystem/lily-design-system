# Tile

## Metadata

- Component: tile
- PascalCase: Tile
- Description: a grouping container that presents related content in a structured format, often as a single clickable area
- HTML tag: <div>
- CSS class: .tile
- Interactive: yes

## Key Behaviors

- Uses `<div>` element for flexible content grouping
- May be interactive (clickable) or static (informational)
- When interactive, manages focus and click behavior

## ARIA

- `aria-label` -- describes the tile for screen readers
- `tabindex="0"` when interactive
- `role="button"` when interactive

## Keyboard

- Tab: Focus the tile (when interactive)
- Enter: Activate the tile (when interactive)
- Space: Activate the tile (when interactive)

## Props

- `label`: string (optional) -- accessible label for the tile
- `interactive`: boolean (default: false) -- whether the tile is clickable
- `onclick`: callback (optional) -- click handler
- `children`: slot (required) -- tile content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="tile"
- [ ] Has aria-label attribute when provided
- [ ] Interactive tiles have tabindex and role="button"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .tile in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tile.html
