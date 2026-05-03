# ContextMenu

A menu that appears on right-click or long-press.

See `components/context-menu/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `context-menu`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContextMenu Label="...">
    Content
</ContextMenu>
```
