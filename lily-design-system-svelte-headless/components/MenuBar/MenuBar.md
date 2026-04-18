# MenuBar

A menu bar is a horizontal menu container using the ARIA menubar role, typically found at the top of an application window. It provides ArrowLeft/ArrowRight keyboard navigation between menu items with Home/End keys to jump to first/last items, implementing the roving focus pattern. Each top-level item may open a submenu or trigger an action.

Compound component: use with MenuBarButton.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: Snippet (required) -- MenuBarButton elements
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```svelte
<MenuBar label="Main menu">
  <MenuBarButton>File</MenuBarButton>
  <MenuBarButton>Edit</MenuBarButton>
  <MenuBarButton>View</MenuBarButton>
</MenuBar>
```

## Keyboard Interactions

- ArrowRight: Move focus to next item (wraps to first)
- ArrowLeft: Move focus to previous item (wraps to last)
- Home: Move focus to first item
- End: Move focus to last item

## ARIA

- `role="menubar"` -- identifies the container as a horizontal menu bar widget
- `aria-label` -- provides the accessible name for the menu bar

## References

- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menubar/
