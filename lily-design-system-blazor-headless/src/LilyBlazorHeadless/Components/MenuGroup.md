# MenuGroup

A labeled section of menu items within a menu.

See `components/menu-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `menu-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MenuGroup Label="...">
    Content
</MenuGroup>
```
