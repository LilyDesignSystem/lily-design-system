# MenuBarButton

A menu bar button is a single interactive item within a menu bar, using the ARIA menuitem role for keyboard navigation and screen reader support. It renders as a `<button>` with `role="menuitem"` and `tabindex="-1"`, designed to be placed inside a MenuBar container with `role="menubar"`.

Focus management is delegated to the parent MenuBar, which uses roving tabindex to move focus between items with arrow keys. The button uses `tabindex="-1"` so it is not reachable via Tab but can receive focus programmatically.

## Props

- `children`: Snippet (required) -- content of the menu bar button
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Usage

```svelte
<MenuBar label="Main menu">
  <MenuBarButton>File</MenuBarButton>
  <MenuBarButton>Edit</MenuBarButton>
  <MenuBarButton>View</MenuBarButton>
</MenuBar>
```

## Keyboard Interactions

- Arrow keys: Focus movement is managed by the parent MenuBar
- Enter / Space: Activate the menu item (native button behavior)

## ARIA

- `role="menuitem"` -- identifies this as an item within a menubar
- `tabindex="-1"` -- removed from tab order; focus managed by parent MenuBar

## References

- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menubar/
