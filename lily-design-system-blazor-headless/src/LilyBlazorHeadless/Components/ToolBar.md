# ToolBar

A horizontal bar of tool actions.

See `components/tool-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tool-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ToolBar Label="...">
    Content
</ToolBar>
```
