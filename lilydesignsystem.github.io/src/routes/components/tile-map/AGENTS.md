# TileMap

## Metadata

- Component: tile-map
- PascalCase: TileMap
- Description: a tile cartogram map with configurable layers for geographic data visualization
- HTML tag: <div>
- CSS class: .tile-map
- Interactive: yes

## Key Behaviors

- Displays geographic data as a grid of equal-sized tiles (cartogram)
- Each tile represents a geographic unit (state, country, region)
- Tiles can be colored, labeled, and made interactive
- Consumer provides tile positioning and styling
- Supports multiple data layers

## ARIA

- `role="img"` with `aria-label` for the overall map
- `aria-roledescription="tile map"` for the map container
- Individual tiles can have `role="listitem"` with labels

## Keyboard

- Arrow keys navigate between tiles
- Enter/Space activates focused tile
- Escape deselects

## Props

- `label`: string (required) -- accessible label describing the map
- `children`: slot (required) -- map layer content (tile-map-layer components or custom)
- `data`: array (optional) -- geographic tile data
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="tile-map"
- [ ] Has role="img" with aria-label
- [ ] Has aria-roledescription="tile map"
- [ ] Arrow keys navigate between tiles
- [ ] Enter/Space activates focused tile
- [ ] Escape deselects
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .tile-map in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tile-map.html
- Reuters Graphics TileMap component
