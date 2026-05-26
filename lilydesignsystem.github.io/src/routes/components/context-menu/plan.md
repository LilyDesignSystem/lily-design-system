# Context Menu — Implementation Plan

## Goal

Implement the Context Menu component: a menu that appears on right-click or long-press.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .context-menu

## Dependencies

- Requires children: context-menu-item

## Approach

1. Use semantic <div> element with class="context-menu"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="context-menu"
- [ ] `role="menu"` -- identifies the container as a menu widget
- [ ] `aria-label` -- provides an accessible name for the menu
- [ ] Keyboard: ArrowDown: Move focus to the next menu item (wraps to first)
- [ ] Keyboard: ArrowUp: Move focus to the previous menu item (wraps to last)
- [ ] Keyboard: Home: Move focus to the first menu item
- [ ] Keyboard: End: Move focus to the last menu item
- [ ] Keyboard: Escape: Close the menu
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
