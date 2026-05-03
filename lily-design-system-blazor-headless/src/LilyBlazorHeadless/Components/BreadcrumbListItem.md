# BreadcrumbListItem

One breadcrumb list item in the trail.

See `components/breadcrumb-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `breadcrumb-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BreadcrumbListItem>
    Content
</BreadcrumbListItem>
```
