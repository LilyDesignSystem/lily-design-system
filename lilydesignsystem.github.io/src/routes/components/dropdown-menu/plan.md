# Dropdown Menu — Implementation Plan

## Goal

Implement the Dropdown Menu component: a menu that opens below a trigger button.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .dropdown-menu

## Approach

1. Use semantic <div> element with class="dropdown-menu"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="dropdown-menu"
- [ ] `aria-haspopup="true"` -- on the trigger button, indicates it opens a menu
- [ ] `aria-expanded="{open}"` -- on the trigger button, communicates whether the menu is currently shown
- [ ] `aria-label="{label}"` -- on both the trigger button and the menu, provides an accessible name
- [ ] `role="menu"` -- on the menu container, identifies it as a menu widget
- [ ] `role="menuitem"` -- expected on each child item provided by the consumer
- [ ] Keyboard: Enter or Space (on button): toggles the menu open/closed
- [ ] Keyboard: ArrowDown: moves focus to the next menu item, wraps from last to first
- [ ] Keyboard: ArrowUp: moves focus to the previous menu item, wraps from first to last
- [ ] Keyboard: Home: moves focus to the first menu item
- [ ] Keyboard: End: moves focus to the last menu item
- [ ] Keyboard: Escape: closes the menu
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
