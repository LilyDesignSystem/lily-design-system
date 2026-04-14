# Dropdown Menu

A dropdown menu triggered by a button that reveals a list of actions or options. This component combines a toggle button with a menu panel, providing a compact way to present multiple actions or choices without taking up permanent screen space. Common use cases include action menus, settings menus, context-sensitive options, and navigation.

The component manages its own focus lifecycle: when the menu opens, focus moves automatically to the first menu item. Arrow key navigation cycles through items with wrapping, and Escape closes the menu. The trigger button communicates its state to assistive technology via `aria-haspopup` and `aria-expanded`.

## Implementation Notes

- Renders a wrapper `<div>` containing a `<button>` trigger and a conditionally rendered menu `<div>`
- Supports two-way binding on the `open` prop with the parent
- Uses reactive state to track the `menuRef` DOM reference for querying menu items
- Uses `$effect()` to auto-focus the first `[role="menuitem"]` element when the menu opens
- Menu items are discovered dynamically via `querySelectorAll("[role='menuitem']")`
- ArrowDown/ArrowUp navigation wraps around from last to first and first to last
- Home and End keys jump to first and last menu items respectively
- Escape key closes the menu
- The trigger button displays the `label` text and uses it as `aria-label`
- Spreads `restProps` onto the outer wrapper `<div>`

## Props

- `label`: string (required) -- accessible name for the menu button, also displayed as button text
- `open`: boolean (default: false) -- whether the menu is visible; bindable
- `children`: slot (required) -- menu items, each should have `role="menuitem"` and `tabindex="-1"`

## Usage

"More actions" dropdown on a card component:

```html
<DropdownMenu label="More actions" open={menuOpen}>
    <MenuItem onclick={() => handleEdit()}>Edit</MenuItem>
    <MenuItem onclick={() => handleDuplicate()}>Duplicate</MenuItem>
    <MenuItem onclick={() => handleDelete()}>Delete</MenuItem>
</DropdownMenu>
```

Settings dropdown with dynamic items:

```html
<DropdownMenu label="Settings" open={settingsOpen}>
    {#each settingsOptions as option}
        <MenuItem onclick={() => handleOption(option)}>
            {option.label}
        </MenuItem>
    {/each}
</DropdownMenu>
```

## Keyboard Interactions

- Enter or Space (on button): toggles the menu open/closed
- ArrowDown: moves focus to the next menu item, wraps from last to first
- ArrowUp: moves focus to the previous menu item, wraps from first to last
- Home: moves focus to the first menu item
- End: moves focus to the last menu item
- Escape: closes the menu

## ARIA

- `aria-haspopup="true"` -- on the trigger button, indicates it opens a menu
- `aria-expanded="{open}"` -- on the trigger button, communicates whether the menu is currently shown
- `aria-label="{label}"` -- on both the trigger button and the menu, provides an accessible name
- `role="menu"` -- on the menu container, identifies it as a menu widget
- `role="menuitem"` -- expected on each child item provided by the consumer

## When to Use

- Use for a menu that opens below a trigger button, such as a "More actions" button.
- Use to present a list of actions or options when screen space is limited.
- Use for settings menus, action menus, or context-sensitive options on cards and rows.
- Use when the menu should appear on click rather than right-click.

## When Not to Use

- Do not use for form selections -- use Select or Combobox instead.
- Do not use for navigation -- use NavigationMenu instead.
- Do not use when the menu should appear on right-click -- use ContextMenu instead.

## Headless

This headless component provides a trigger `<button>` with `aria-haspopup` and `aria-expanded`, a `<div>` menu container with `role="menu"`, automatic focus management (first item on open), full arrow key navigation with wrapping, Home/End support, and Escape dismissal. The consumer provides all visual styling, positioning, animation, and menu item content.


## Styles

The consumer provides all CSS styling. The component renders with a `.dropdown-menu` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `dropdown-menu`
- Verify aria-label="{label}"` -- on both the trigger button and the menu, provides an accessible name
- Verify role="menu"` -- on the menu container, identifies it as a menu widget
- Verify role="menuitem"` -- expected on each child item provided by the consumer
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position the menu directly below the trigger button. Keep the menu width consistent and avoid overly long item labels. Use separators for grouping related actions.
- **Developers**: Ensure each child element has `role="menuitem"` and `tabindex="-1"`. Return focus to the trigger button after the menu closes.

## References

- WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menubutton/
- WAI-ARIA menu role: https://www.w3.org/TR/wai-aria-1.2/#menu
- WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem
