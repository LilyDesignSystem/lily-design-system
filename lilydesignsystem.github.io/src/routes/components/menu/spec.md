# Menu — Specification

Single source of truth for spec-driven development of the Menu component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Menu component: a list of actions or options triggered by a button.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .menu

## Dependencies

- Requires children: menu-item

## Approach

1. Use semantic <div> element with class="menu"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="menu"
- [ ] `role="menu"` -- identifies the container as a menu widget for presenting a list of actions.
- [ ] `aria-label` -- provides an accessible name describing the purpose of the menu.
- [ ] Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu items.
- [ ] Keyboard: ArrowDown: Moves focus to the next menu item, wrapping to the first item from the last.
- [ ] Keyboard: ArrowUp: Moves focus to the previous menu item, wrapping to the last item from the first.
- [ ] Keyboard: Home: Moves focus to the first menu item.
- [ ] Keyboard: End: Moves focus to the last menu item.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .menu to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (menu.html)
- [ ] Implement HTML headless test (menu.test.js)
- [ ] Implement child component: menu-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
