# TreeMenu

A hierarchical tree menu with expandable branches.

See `components/tree-menu/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tree-menu`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TreeMenu Label="...">
    Content
</TreeMenu>
```
