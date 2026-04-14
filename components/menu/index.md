# Menu

A menu is a container for a list of actions or options, using the ARIA menu role with full keyboard navigation support. Menus are typically used for context menus, action menus triggered by buttons, and dropdown menus that present a set of commands or functions. Each item in the menu is a discrete action rather than a selectable option (for selection, use Listbox instead).

The component manages vertical focus movement between menu items via arrow keys, with Home and End keys to jump to the first and last items. The consumer provides menu item elements as children and handles item activation externally.

## Implementation Notes

- Renders a `<div>` with `role="menu"` and an accessible label.
- Uses reactive state to track the `menuRef` element reference for querying child items.
- Keyboard navigation queries all child elements with `[role='menuitem']` to build the navigable item list.
- Arrow keys wrap around: pressing ArrowDown on the last item moves focus to the first, and vice versa.
- Home and End keys jump to the first and last menu item respectively.
- Spreads `restProps` onto the container for consumer customization.
- This is a compound component -- pair with MenuItem for individual menu actions.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `children`: slot (required) -- menu item elements to render inside the menu (should have `role="menuitem"` and `tabindex="-1"`).
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Usage

Actions menu with MenuItem children:

```html
<Menu label="Actions">
    <MenuItem onclick={() => handleCut()}>Cut</MenuItem>
    <MenuItem onclick={() => handleCopy()}>Copy</MenuItem>
    <MenuItem onclick={() => handlePaste()}>Paste</MenuItem>
</Menu>
```

Dynamic actions menu from a list:

```html
<Menu label="File actions">
    {#each actions as action}
        <MenuItem onclick={() => handleAction(action)}>
            {action.label}
        </MenuItem>
    {/each}
</Menu>
```

Menu with a disabled item:

```html
<Menu label="Edit">
    <MenuItem onclick={() => handleUndo()}>Undo</MenuItem>
    <MenuItem aria-disabled="true">Redo</MenuItem>
</Menu>
```

## Keyboard Interactions

- ArrowDown: Moves focus to the next menu item, wrapping to the first item from the last.
- ArrowUp: Moves focus to the previous menu item, wrapping to the last item from the first.
- Home: Moves focus to the first menu item.
- End: Moves focus to the last menu item.

## ARIA

- `role="menu"` -- identifies the container as a menu widget for presenting a list of actions.
- `aria-label` -- provides an accessible name describing the purpose of the menu.
- Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu items.

## When to Use

- Use for a list of actions or options triggered by a button, such as an actions menu on a record.
- Use when each item is a discrete action (e.g., Cut, Copy, Paste) rather than a selectable option.
- Use for action menus on table rows, card components, or toolbar overflow buttons.
- Use when the menu needs vertical arrow key navigation with wrapping.

## When Not to Use

- Do not use for site navigation -- use NavigationMenu instead.
- Do not use for right-click menus -- use ContextMenu instead.
- Do not use for selecting one or more options from a list -- use Listbox instead.

## Headless

This headless component provides the ARIA menu role, keyboard navigation (arrow keys with wrapping, Home, End), and focus management for child menuitem elements. The consumer provides all visual styling, including menu positioning, item appearance, hover states, and animations.


## Styles

The consumer provides all CSS styling. The component renders with a `.menu` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `menu`
- Verify role="menu"` -- identifies the container as a menu widget for presenting a list of actions.
- Verify aria-label` -- provides an accessible name describing the purpose of the menu.
- Verify Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu items.
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear hover and focus indicators for menu items, and group related actions visually with separators when the menu is long.
- **Developers**: Ensure each child element uses `role="menuitem"` with `tabindex="-1"`. Use the MenuItem component for consistent markup.

## Composition

Menu is a compound component that contains MenuItem children. Each MenuItem provides `role="menuitem"` semantics, while Menu provides the `role="menu"` container with keyboard navigation.

```
Menu (role="menu") → MenuItem (role="menuitem")
```

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menu/
