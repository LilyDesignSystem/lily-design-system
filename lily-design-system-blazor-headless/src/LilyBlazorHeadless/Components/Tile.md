# Tile

A grouping container that presents related content in a structured format, often as a single clickable area.

See `components/tile/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tile`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Tile>
    Content
</Tile>
```
