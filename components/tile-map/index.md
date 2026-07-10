# TileMap

A tile cartogram map with configurable layers for geographic data visualization, where each geographic unit is represented as an equal-sized tile.

This headless component uses a `<div>` element with `role="img"` and `aria-label` to present a grid of tiles representing geographic data.

## Implementation Notes

- Uses `<div>` element with `role="img"` for the map container
- `aria-roledescription="tile map"` provides descriptive context for assistive technology
- Displays geographic data as a grid of equal-sized tiles (cartogram)
- Each tile represents a geographic unit (state, country, region)
- Tiles can be colored, labeled, and made interactive
- Consumer provides tile positioning and styling
- Supports multiple data layers

## Props

- `label`: string (required) -- accessible label describing the map
- `children`: slot (required) -- map layer content (tile-map-layer components or custom)
- `data`: array (optional) -- geographic tile data
- `...restProps`: Any additional HTML attributes

## Usage

```html
<TileMap label="US election results by state" data={stateData}>
  <div class="tile" style="grid-column: 11; grid-row: 1">ME</div>
  <div class="tile" style="grid-column: 1; grid-row: 2">AK</div>
  <!-- ... more tiles -->
</TileMap>
```

```html
<TileMap label="European countries by population density">
  <div class="tile" style="grid-column: 3; grid-row: 1" aria-label="United Kingdom: 281 per km2">UK</div>
  <div class="tile" style="grid-column: 4; grid-row: 2" aria-label="France: 119 per km2">FR</div>
  <div class="tile" style="grid-column: 5; grid-row: 2" aria-label="Germany: 240 per km2">DE</div>
</TileMap>
```

```html
<TileMap label="US COVID-19 vaccination rates by state">
  <div class="tile tile--high" style="grid-column: 10; grid-row: 1" aria-label="Vermont: 82%">VT</div>
  <div class="tile tile--low" style="grid-column: 7; grid-row: 7" aria-label="Alabama: 51%">AL</div>
</TileMap>
```

## Keyboard Interactions

- Arrow keys navigate between tiles
- Enter/Space activates focused tile
- Escape deselects the currently selected tile

## ARIA

- `role="img"` with `aria-label` for the overall map
- `aria-roledescription="tile map"` for the map container
- Individual tiles can have `role="listitem"` with `aria-label` for data values

## When to Use

- Use for geographic data where equal representation matters more than geographic accuracy
- Use to compare values across geographic regions at a glance
- Use when geographic shape or area would distort data perception (e.g., election results, population statistics)

## When Not to Use

- Do not use when geographic shape or area matters -- use a standard map
- Do not use for non-geographic grid data -- use DataTable
- Do not use when precise geographic boundaries are important

## Headless

This component provides a `<div>` element with `role="img"`, `aria-label`, and `aria-roledescription` for accessible geographic visualization, with zero visual styling. The consumer is responsible for all CSS including tile size, grid positioning, colors, labels, hover effects, and responsive layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.tile-map` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `tile-map`
- Verify `role="img"` is applied
- Verify `aria-label` is applied
- Verify `aria-roledescription="tile map"` is applied
- Verify arrow key navigation between tiles
- Verify Enter/Space activates focused tile
- Verify Escape deselects
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Choose tile colors with sufficient contrast for WCAG 2.2 AAA compliance. Include a legend explaining color mappings. Consider how the cartogram layout communicates equal representation versus geographic accuracy.
- **Developers**: Always provide a descriptive `label` prop for screen reader users. Add `aria-label` to individual tiles with data values. Ensure keyboard navigation follows a logical reading order through the grid.

## Related components

- `tile` — a grouping container that presents related content in a structured format, often as a single clickable area
- `image` — an image element with alt text

## References

- [Reuters Graphics TileMap component](https://github.com/reuters-graphics/graphics-components)

---

Lily™ and Lily Design System™ are trademarks.
