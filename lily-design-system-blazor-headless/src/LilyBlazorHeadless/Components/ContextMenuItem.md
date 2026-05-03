# ContextMenuItem

One item in a context menu.

See `components/context-menu-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `context-menu-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContextMenuItem>
    Content
</ContextMenuItem>
```
