# Tour

A tour guide, such as for sightseeing, or pathways, or demonstrations, etc..

See `components/tour/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tour`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Tour Label="...">
    Content
</Tour>
```
