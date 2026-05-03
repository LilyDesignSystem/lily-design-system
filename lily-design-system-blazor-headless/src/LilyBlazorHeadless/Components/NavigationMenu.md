# NavigationMenu

A site-wide navigation menu with links.

See `components/navigation-menu/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `navigation-menu`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NavigationMenu Label="...">
    Content
</NavigationMenu>
```
