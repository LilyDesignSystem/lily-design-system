# ContextMenu

A context menu provides a list of actions relevant to the current context, typically triggered by a right-click or long-press. The menu appears near the pointer and offers contextual options such as cut, copy, paste, or custom actions.

This component manages menu visibility, keyboard navigation, and focus. When opened, focus moves to the first menu item automatically. Arrow keys navigate between items with wrapping, and Escape closes the menu. Consumers trigger opening externally (e.g., via a `contextmenu` event handler) and provide `role="menuitem"` children.

## Implementation Notes

- Renders a `<div>` with `role="menu"` and `aria-label`, conditionally shown via `{#if open}`
- Uses `$bindable(false)` for the `open` prop for two-way binding
- `$state()` tracks the menu element reference for focus management
- `$effect()` focuses the first `[role="menuitem"]` when the menu opens
- Keyboard handler navigates items with ArrowDown/ArrowUp (wrapping), Home/End, and Escape to close
- Spreads `restProps` onto the menu container

## Props

- `label`: string (required) -- accessible name for the context menu via `aria-label`
- `open`: boolean (default: false) -- whether the menu is visible; bindable for two-way control
- `children`: Snippet (required) -- menu item content (should include `role="menuitem"` elements)

## Usage

```svelte
<ContextMenu label="Actions" bind:open>
  <li role="menuitem" tabindex="-1">Cut</li>
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
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

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menu/
