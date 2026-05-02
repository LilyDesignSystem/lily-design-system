# TileMap

A tile cartogram map: a grid of equal-sized tiles where each tile represents a geographic unit (state, country, region) so all units have equal visual weight regardless of their physical size. The component is a structural wrapper — the consumer provides tile positioning, colour, and content.

## Props

- `className`: string (optional) — CSS class appended to `tile-map`
- `label`: string (required) — accessible label describing the map (`aria-label`)
- `children`: ReactNode (required) — tile layer content
- `...restProps`: unknown — additional attributes spread onto the `<div>`

## Keyboard

Each tile must be a focusable element with a `data-tile` attribute (typically `<button data-tile>`). The component handles arrow-key navigation between them.

- `ArrowRight` / `ArrowLeft` — move focus through the tile order
- `ArrowUp` / `ArrowDown` — move focus to the geometrically nearest tile in that direction
- `Enter` / `Space` — dispatch a `tile-activate` `CustomEvent` on the focused tile (consumer listens with `addEventListener("tile-activate", ...)`)
- `Escape` — blur the focused tile

## Usage

```tsx
<TileMap label="US states by population">
  {states.map((s) => (
    <button
      key={s.abbr}
      data-tile
      tabIndex={s.abbr === "CA" ? 0 : -1}
      style={{ gridArea: s.gridArea, background: scale(s.population) }}
      onClick={() => select(s)}
    >
      {s.abbr}
    </button>
  ))}
</TileMap>
```

## References

- Reuters Graphics TileMap component
- WAI-ARIA roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
