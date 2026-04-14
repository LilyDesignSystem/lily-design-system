# Menu Bar Button

A menu bar item is a single interactive item within a menu bar, using the ARIA menuitem role for keyboard navigation and screen reader support. It renders as a `<div>` with `role="menuitem"` and is designed to be placed inside a MenuBar container with `role="menubar"`.

Focus management is delegated to the parent MenuBar, which uses roving tabindex to move focus between items with arrow keys. The item itself uses `tabindex="-1"` so it is not reachable via Tab but can receive focus programmatically.

## Implementation Notes

- Renders as a `<div>` with `role="menuitem"` for ARIA menubar semantics
- Uses `tabindex="-1"` so focus is managed programmatically by the parent MenuBar
- Content is provided through child elements
- Passes through all additional HTML attributes via `...restProps`
- Designed to be placed inside a MenuBar container with `role="menubar"`

## Props

- `children`: slot (required) -- content of the menu bar item
- `...restProps`: Any additional HTML attributes passed to the `<div>` element

## Usage

Menu bar buttons inside a MenuBar:

```html
<MenuBar label="Application menu">
    <MenuBarButton onclick={() => openFileMenu()}>File</MenuBarButton>
    <MenuBarButton onclick={() => openEditMenu()}>Edit</MenuBarButton>
    <MenuBarButton onclick={() => openViewMenu()}>View</MenuBarButton>
</MenuBar>
```

Menu bar button with submenu expansion:

```html
<MenuBarButton aria-haspopup="true" aria-expanded={isFileMenuOpen}>File</MenuBarButton>
```

## Keyboard Interactions

- Arrow keys: Focus movement is managed by the parent MenuBar
- Enter / Space: Activate the menu item (consumer-provided handler)
- `tabindex="-1"` enables programmatic focus from parent keyboard navigation

## ARIA

- `role="menuitem"` -- identifies this as an item within a menubar
- `tabindex="-1"` -- removed from tab order; focus managed by parent MenuBar

## When to Use

- Use inside MenuBar to represent one menu trigger.
- Use when each item needs `role="menuitem"` semantics and roving tabindex focus management from the parent MenuBar.
- Use for top-level menu entries like File, Edit, View, or Help.

## When Not to Use

- Do not use outside MenuBar -- it relies on the parent for keyboard navigation.
- Do not use for tab selection -- use TabBarButton instead.
- Do not use for toolbar actions -- use ToolBarButton instead.

## Headless

This headless component provides a `<div>` with `role="menuitem"` and `tabindex="-1"` for roving focus managed by the parent MenuBar. The consumer provides all visual styling, including item appearance, hover states, active indicators, and submenu expansion affordances.


## Styles

The consumer provides all CSS styling. The component renders with a `.menu-bar-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `menu-bar-button`
- Verify role="menuitem"` -- identifies this as an item within a menubar
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure menu bar items have adequate click/touch target sizes and provide visual feedback on hover and focus.
- **Developers**: Do not set `tabindex="0"` on individual items; the parent MenuBar manages focus via roving tabindex. Add `aria-haspopup` and `aria-expanded` if the item opens a submenu.

## Composition

MenuBarButton is a child component of MenuBar. The parent MenuBar provides `role="menubar"` with horizontal keyboard navigation, while MenuBarButton provides `role="menuitem"` for each entry.

```
MenuBar (role="menubar") → MenuBarButton (role="menuitem")
```

## References

- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menubar/
