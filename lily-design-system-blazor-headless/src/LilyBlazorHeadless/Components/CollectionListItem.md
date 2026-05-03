# CollectionListItem

One item in a collection list with optional image, heading, meta, and description.

See `components/collection-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `collection-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CollectionListItem>
    Content
</CollectionListItem>
```
