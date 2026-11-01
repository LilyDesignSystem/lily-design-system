# TileMap

A tile cartogram map with configurable layers for geographic data visualization.

See `components/tile-map/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tile-map`
- `ChildContent`: RenderFragment — the tiles: focusable `[data-tile]` elements, positioned by the consumer
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TileMap Label="Population by region">
    <div data-tile tabindex="0">North</div>
</TileMap>
```

## Keyboard

ArrowRight and ArrowLeft step through the tiles in order, stopping at the ends; ArrowDown and ArrowUp go to the nearest
tile in the next or previous row, by position on screen; Enter and Space dispatch a bubbling `tile-activate` event on the
focused tile; Escape deselects it. The keys are handled in `TileMap.razor.js`, a JavaScript module the component loads
after its first interactive render; with static server rendering there is no keyboard handling.
