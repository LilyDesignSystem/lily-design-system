# MenuItem

A menu item is a UI/UX component representing a single action or option within
a menu, dropdown menu, or navigation menu. Menus are used throughout
applications to organize and present actions, settings, and navigation options
in a structured, discoverable format.

This component renders as a `<div>` with `role="menuitem"` and `tabindex="-1"`,
following the WAI-ARIA menu pattern. The `tabindex="-1"` removes the item from
the normal tab order so that the parent menu can manage focus
programmatically using Arrow keys. The consumer provides the menu item content
(action label, keyboard shortcut hint, etc.) through the children snippet.
Menu items should be placed within a container with `role="menu"` or
`role="menubar"`. Items that open submenus can use `aria-haspopup` and
`aria-expanded` attributes.

## Implementation Notes

- Renders as `<div role="menuitem" tabindex="-1">` for menu items
- `tabindex="-1"` supports roving focus managed by the parent menu
- Should be placed inside a `role="menu"` or `role="menubar"` container
- Focus management (ArrowUp/ArrowDown) is handled by the parent menu component
- All content provided through children snippet; no hardcoded strings

## Props

- `children`: ReactNode -- menu item content
- `...restProps`: Any additional HTML attributes spread onto the `<div>`

## Usage

```tsx
import MenuItem from "./MenuItem";

<div role="menu">
  <MenuItem>New File</MenuItem>
  <MenuItem>Open File</MenuItem>
  <MenuItem>Save</MenuItem>
  <MenuItem>Exit</MenuItem>
</div>
```

With click handlers:

```tsx
<div role="menu">
  <MenuItem onClick={() => handleNew()}>New File</MenuItem>
  <MenuItem onClick={() => handleOpen()}>Open File</MenuItem>
  <MenuItem onClick={() => handleSave()}>Save</MenuItem>
</div>
```

Disabled menu item:

```tsx
<MenuItem aria-disabled="true">Paste</MenuItem>
```

Submenu trigger:

```tsx
<MenuItem aria-haspopup="true" aria-expanded={submenuOpen}>Recent Files</MenuItem>
```

## Keyboard Interactions

- Focus is managed by the parent menu using ArrowUp/ArrowDown
- Enter or Space activates the menu item (handled by consumer event listeners)
- Home/End move focus to the first/last item (handled by the parent menu)

## ARIA

- `role="menuitem"` identifies this as a menu item
- `tabindex="-1"` for roving focus management
- Supports `aria-disabled` for disabled state
- Supports `aria-haspopup` for submenu triggers
- Supports `aria-expanded` for items with open/closed submenus

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
- WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem
