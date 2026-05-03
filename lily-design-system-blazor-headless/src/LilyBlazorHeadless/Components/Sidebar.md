# Sidebar

A side panel for navigation or supplementary content.

See `components/sidebar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `sidebar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Sidebar Label="...">
    Content
</Sidebar>
```
