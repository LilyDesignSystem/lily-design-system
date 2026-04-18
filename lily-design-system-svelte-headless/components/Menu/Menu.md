# Menu

A menu is a container for a list of actions or options, using the ARIA menu role with full keyboard navigation support. Menus are typically used for context menus, action menus triggered by buttons, and dropdown menus that present a set of commands or functions. Each item in the menu is a discrete action rather than a selectable option (for selection, use Listbox instead).

The component manages vertical focus movement between menu items via arrow keys, with Home and End keys to jump to the first and last items. The consumer provides menu item elements as children and handles item activation externally.

## Implementation Notes

- Renders a `<div>` with `role="menu"` and an accessible label.
- Uses `$state` to track the `menuRef` element reference for querying child items.
- Keyboard navigation queries all child elements with `[role='menuitem']` to build the navigable item list.
- Arrow keys wrap around: pressing ArrowDown on the last item moves focus to the first, and vice versa.
- Home and End keys jump to the first and last menu item respectively.
- Spreads `restProps` onto the container for consumer customization.
- This is a compound component -- pair with MenuItem for individual menu actions.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `children`: Snippet (required) -- menu item elements to render inside the menu (should have `role="menuitem"` and `tabindex="-1"`).
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Usage

```svelte
<Menu label="Actions">
    <div role="menuitem" tabindex="-1">Cut</div>
    <div role="menuitem" tabindex="-1">Copy</div>
</Menu>
```

```svelte
<Menu label="File actions">
    {#each actions as action}
        <div role="menuitem" tabindex="-1" onclick={() => handleAction(action)}>
            {action.label}
        </div>
    {/each}
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

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menu/
