# DescriptionListItem

One key-value pair in a description list using dt and dd elements.

See `components/description-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `description-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DescriptionListItem>
    Content
</DescriptionListItem>
```
