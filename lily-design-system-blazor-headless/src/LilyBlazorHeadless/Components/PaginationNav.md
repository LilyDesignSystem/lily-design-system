# PaginationNav

An ordered list of page navigation links.

See `components/pagination-nav/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `pagination-nav`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PaginationNav Label="...">
    Content
</PaginationNav>
```
