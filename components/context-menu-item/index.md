# Context Menu Item

A context menu item is a UI/UX component representing a single action or option within a context menu (also known as a right-click menu). Context menus appear in response to a secondary interaction (typically right-click on desktop or long-press on mobile) and provide contextually relevant actions for the element that was interacted with.

This component renders as a div with `role="menuitem"` and `tabindex="-1"`, following the WAI-ARIA menu pattern. The `tabindex="-1"` removes the item from the normal tab order so that the parent menu can manage focus programmatically using Arrow keys. The consumer provides the menu item content (action label, keyboard shortcut hint, etc.) through the children slot. Context menu items should be placed within a container with `role="menu"`.

## Implementation Notes

- Renders as `<div role="menuitem" tabindex="-1">` for context menu items
- `tabindex="-1"` supports roving focus managed by the parent menu
- Should be placed inside a `role="menu"` container
- Focus management (ArrowUp/ArrowDown) is handled by the parent menu component
- All additional HTML attributes are spread onto the div via `restProps`

## Props

- `children`: slot (required) -- menu item content (text, icon, shortcut hint, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the div

## Usage

Context menu items inside a ContextMenu with click handlers:

```html
<ContextMenu label="Text actions" open={open}>
    <ContextMenuItem onclick={() => handleCut()}>Cut</ContextMenuItem>
    <ContextMenuItem onclick={() => handleCopy()}>Copy</ContextMenuItem>
    <ContextMenuItem onclick={() => handlePaste()}>Paste</ContextMenuItem>
    <ContextMenuItem aria-disabled="true">Delete</ContextMenuItem>
</ContextMenu>
```

Context menu item with keyboard shortcut hint:

```html
<ContextMenuItem aria-keyshortcuts="Control+C" onclick={() => handleCopy()}>
    Copy
</ContextMenuItem>
```

## Keyboard Interactions

- Focus is managed by the parent menu using ArrowUp/ArrowDown
- Enter or Space activates the menu item (handled by consumer event listeners)

## ARIA

- `role="menuitem"` -- identifies this element as an item within a menu
- `tabindex="-1"` -- supports roving focus management by the parent menu
- Supports `aria-disabled` for disabled state (added by consumer)
- Supports `aria-keyshortcuts` for keyboard shortcut hints (added by consumer)

## When to Use

- Use inside ContextMenu for one action.
- Use for each action or option within a context menu, such as cut, copy, paste, or delete.
- Use when the action needs keyboard shortcut hints or icon labels alongside the action text.

## When Not to Use

- Do not use outside ContextMenu -- it requires a parent with `role="menu"` for proper ARIA semantics.
- Do not use for regular menu items -- use MenuItem inside Menu instead.

## Headless

This headless ContextMenuItem component provides a `<div>` with `role="menuitem"` and `tabindex="-1"` for roving focus managed by the parent ContextMenu. The consumer provides all visual styling including text layout, icon placement, keyboard shortcut hints, hover/focus states, and disabled appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.context-menu-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `context-menu-item`
- Verify role="menuitem"` -- identifies this element as an item within a menu
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Show keyboard shortcut hints right-aligned within each menu item for discoverability. Use a disabled visual state for unavailable actions.
- **Developers**: Add `aria-disabled="true"` for disabled items and `aria-keyshortcuts` for keyboard shortcut hints. Focus management is handled by the parent ContextMenu.

## Composition

ContextMenuItem is the child component in the ContextMenu/ContextMenuItem composition pattern. Place ContextMenuItem components inside a ContextMenu. Each item receives focus programmatically via the parent's ArrowUp/ArrowDown keyboard navigation, so set `tabindex="-1"` to support roving focus.

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menu/
