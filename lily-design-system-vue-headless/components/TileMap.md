# TileMap

A tile cartogram map: a grid of equal-sized tiles where each tile represents a geographic unit (state, country, region) so all units have equal visual weight regardless of their physical size.

## Props

- `label`: string (required) — accessible label describing the map (`aria-label`)

## Slots

- default — tile layer content

## Keyboard

Each tile must be a focusable element with a `data-tile` attribute (typically `<button data-tile>`).

- `ArrowRight` / `ArrowLeft` — move focus through the tile order
- `ArrowUp` / `ArrowDown` — move focus to the geometrically nearest tile in that direction
- `Enter` / `Space` — dispatch a `tile-activate` `CustomEvent` on the focused tile
- `Escape` — blur the focused tile

## Usage

```vue
<TileMap label="US states by population">
  <button
    v-for="s in states"
    :key="s.abbr"
    data-tile
    :tabindex="s.abbr === selected ? 0 : -1"
    :style="{ gridArea: s.gridArea, background: scale(s.population) }"
    @tile-activate="select(s)"
  >
    {{ s.abbr }}
  </button>
</TileMap>
```

## References

- Reuters Graphics TileMap component
- WAI-ARIA roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
