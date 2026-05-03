# DocumentListItem

One document entry in a document list.

See `components/document-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `document-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DocumentListItem>
    Content
</DocumentListItem>
```
