# NavigationMenu

a site-wide navigation menu with links

This is the Angular headless implementation. See `components/navigation-menu/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-navigation-menu></lily-navigation-menu>
```

## Inputs

- `label`: string -- accessible name (`aria-label`).
- `className`: string -- appended to the root class list.
- `overflow`: boolean (default `false`) -- overflow mode: the projected content must be `<li>` items; they render in `<ul class="navigation-menu-list">` beside a hidden "More" disclosure and a `ResizeObserver` moves the items that do not fit into it. Publishes `data-overflow="true"`. Keep the item set static.
- `moreLabel`: string (required with `overflow`) -- the More button's accessible name; no English default.

## Files

- `NavigationMenu.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `NavigationMenu.spec.ts` — vitest + TestBed render test
