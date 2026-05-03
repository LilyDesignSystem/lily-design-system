# PaginationList

An ordered list of pagination list items.

See `components/pagination-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `pagination-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PaginationList Label="...">
    Content
</PaginationList>
```
