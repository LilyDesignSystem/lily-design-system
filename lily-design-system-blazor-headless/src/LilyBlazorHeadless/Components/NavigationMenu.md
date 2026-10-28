# NavigationMenu

A site-wide navigation menu with links.

See `components/navigation-menu/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Overflow`: bool (default false) — overflow mode: content must be `<li>` items, rendered in `<ul class="navigation-menu-list">` beside a hidden "More" disclosure; publishes `data-overflow="true"`. The measuring runs in `NavigationMenu.razor.js` via JS interop after first render (skipped during prerender); without it the links wrap.
- `MoreLabel`: string (required with `Overflow`) — the More button's accessible name; no English default
- `CssClass`: string — extra CSS classes appended to `navigation-menu`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NavigationMenu Label="...">
    Content
</NavigationMenu>
```
