# Context Menu

A context menu provides a list of actions relevant to the current context, typically triggered by a right-click or long-press. The menu appears near the pointer and offers contextual options such as cut, copy, paste, or custom actions.

This component manages menu visibility, keyboard navigation, and focus. When opened, focus moves to the first menu item automatically. Arrow keys navigate between items with wrapping, and Escape closes the menu. Consumers trigger opening externally (e.g., via a `contextmenu` event handler) and provide `role="menuitem"` children.

## Implementation Notes

- Renders a `<div>` with `role="menu"` and `aria-label`, conditionally shown via conditional rendering
- Supports two-way binding on the `open` prop
- reactive state tracks the menu element reference for focus management
- `$effect()` focuses the first `[role="menuitem"]` when the menu opens
- Keyboard handler navigates items with ArrowDown/ArrowUp (wrapping), Home/End, and Escape to close
- Spreads `restProps` onto the menu container

## Props

- `label`: string (required) -- accessible name for the context menu via `aria-label`
- `open`: boolean (default: false) -- whether the menu is visible; bindable for two-way control
- `children`: slot (required) -- menu item content (should include `role="menuitem"` elements)

## Usage

Context menu with ContextMenuItem children:

```html
<ContextMenu label="Text actions" open={isContextMenuOpen}>
    <ContextMenuItem onclick={() => handleCut()}>Cut</ContextMenuItem>
    <ContextMenuItem onclick={() => handleCopy()}>Copy</ContextMenuItem>
    <ContextMenuItem onclick={() => handlePaste()}>Paste</ContextMenuItem>
</ContextMenu>
```

Triggered on right-click of a target element:

```html
<div oncontextmenu={(e) => { e.preventDefault(); isContextMenuOpen = true; }}>
    Right-click this area for options
</div>
<ContextMenu label="Item actions" open={isContextMenuOpen}>
    <ContextMenuItem onclick={() => handleEdit()}>Edit</ContextMenuItem>
    <ContextMenuItem onclick={() => handleDelete()}>Delete</ContextMenuItem>
</ContextMenu>
```

## Keyboard Interactions

- ArrowDown: Move focus to the next menu item (wraps to first)
- ArrowUp: Move focus to the previous menu item (wraps to last)
- Home: Move focus to the first menu item
- End: Move focus to the last menu item
- Escape: Close the menu

## ARIA

- `role="menu"` -- identifies the container as a menu widget
- `aria-label` -- provides an accessible name for the menu

## When to Use

- Use for a menu that appears on right-click or long-press.
- Use for contextual actions on specific items such as cut, copy, paste, or custom actions.
- Use when actions apply to a specific element and displaying them inline would clutter the interface.
- Use to provide supplementary actions alongside visible primary controls.

## When Not to Use

- Do not use as the only way to access actions -- ensure alternatives exist for accessibility.
- Do not use for global menus -- use Menu or DropdownMenu instead.
- Do not use for navigation links -- use NavigationMenu instead.

## Headless

This headless ContextMenu component provides a `<div>` with `role="menu"` and `aria-label`, automatic focus management (first item receives focus on open), keyboard navigation with ArrowUp/ArrowDown wrapping, Home/End, and Escape to close. The consumer provides all visual styling including positioning near the pointer, background, borders, shadows, and item appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.context-menu` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `context-menu`
- Verify role="menu"` -- identifies the container as a menu widget
- Verify aria-label` -- provides an accessible name for the menu
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position the menu near the trigger point and ensure it does not overflow the viewport. Group related actions with visual separators.
- **Developers**: Trigger the menu by handling the `contextmenu` event on the target element and setting `open` to true. Use ContextMenuItem components as children with `role="menuitem"`.

## Composition

ContextMenu follows the Menu/MenuItem composition pattern. Use ContextMenu as the container with ContextMenuItem components as children. The ContextMenu manages focus and keyboard navigation, while each ContextMenuItem renders as a `role="menuitem"` element with `tabindex="-1"` for roving focus.

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menu/
