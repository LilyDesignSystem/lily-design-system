# TreeNav

A hierarchical navigation with expandable branches.

See `components/tree-nav/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tree-nav`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TreeNav Label="...">
    Content
</TreeNav>
```
