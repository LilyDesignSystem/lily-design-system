# ContextMenu

## Metadata

- Component: context-menu
- PascalCase: ContextMenu
- Description: a menu that appears on right-click or long-press
- HTML tag: <div>
- CSS class: .context-menu
- Interactive: yes

## Composition

- Pattern: Menu/MenuItem
- Children: context-menu-item

## Key Behaviors

- Renders a `<div>` with `role="menu"` and `aria-label`, conditionally shown via conditional rendering
- Supports two-way binding on the `open` prop
- reactive state tracks the menu element reference for focus management
- `$effect()` focuses the first `[role="menuitem"]` when the menu opens
- Keyboard handler navigates items with ArrowDown/ArrowUp (wrapping), Home/End, and Escape to close
- Spreads `restProps` onto the menu container

## ARIA

- `role="menu"` -- identifies the container as a menu widget
- `aria-label` -- provides an accessible name for the menu

## Keyboard

- ArrowDown: Move focus to the next menu item (wraps to first)
- ArrowUp: Move focus to the previous menu item (wraps to last)
- Home: Move focus to the first menu item
- End: Move focus to the last menu item
- Escape: Close the menu

## Props

- `label`: string (required) -- accessible name for the context menu via `aria-label`
- `open`: boolean (default: false) -- whether the menu is visible; bindable for two-way control
- `children`: slot (required) -- menu item content (should include `role="menuitem"` elements)

## Acceptance Criteria

- [ ] Renders <div> element with class="context-menu"
- [ ] Has aria-label attribute
- [ ] Has role="menu"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .context-menu in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/context-menu.html
- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
