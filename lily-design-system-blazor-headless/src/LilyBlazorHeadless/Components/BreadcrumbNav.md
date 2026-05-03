# BreadcrumbNav

A navigation container for breadcrumb trail links.

See `components/breadcrumb-nav/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `breadcrumb-nav`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BreadcrumbNav Label="...">
    Content
</BreadcrumbNav>
```
