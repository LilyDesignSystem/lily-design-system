# PhotoPack

A collection of photos displayed together as a group.

See `components/photo-pack/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `photo-pack`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PhotoPack Label="...">
    Content
</PhotoPack>
```
