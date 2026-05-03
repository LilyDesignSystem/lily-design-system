# TileMap

A tile cartogram map with configurable layers for geographic data visualization.

See `components/tile-map/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tile-map`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TileMap Label="...">
    Content
</TileMap>
```
