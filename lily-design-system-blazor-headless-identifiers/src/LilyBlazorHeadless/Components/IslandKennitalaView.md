# IslandKennitalaView

A a read-only display of Iceland's Kennitala.

See `components/island-kennitala-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `island-kennitala-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<IslandKennitalaView Label="Personal Identity Code">...</IslandKennitalaView>
```
