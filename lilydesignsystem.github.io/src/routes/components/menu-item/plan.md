# Menu Item — Implementation Plan

## Goal

Implement the Menu Item component: one item in a menu.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .menu-item

## Dependencies

- Requires parent: menu

## Approach

1. Use semantic <div> element with class="menu-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="menu-item"
- [ ] `role="menuitem"` identifies this as a menu item
- [ ] Supports `aria-disabled` for disabled state
- [ ] Supports `aria-haspopup` for submenu triggers
- [ ] Supports `aria-expanded` for items with open/closed submenus
- [ ] Keyboard: Focus is managed by the parent menu using ArrowUp/ArrowDown
- [ ] Keyboard: Enter or Space activates the menu item (handled by consumer event listeners)
- [ ] Keyboard: Home/End move focus to the first/last item (handled by the parent menu)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
