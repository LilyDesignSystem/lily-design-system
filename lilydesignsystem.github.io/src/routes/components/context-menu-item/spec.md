# Context Menu Item — Specification

Single source of truth for spec-driven development of the Context Menu Item component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Context Menu Item component: one item in a context menu.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .context-menu-item

## Dependencies

- Requires parent: context-menu

## Approach

1. Use semantic <div> element with class="context-menu-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="context-menu-item"
- [ ] `role="menuitem"` -- identifies this element as an item within a menu
- [ ] Supports `aria-disabled` for disabled state (added by consumer)
- [ ] Supports `aria-keyshortcuts` for keyboard shortcut hints (added by consumer)
- [ ] Keyboard: Focus is managed by the parent menu using ArrowUp/ArrowDown
- [ ] Keyboard: Enter or Space activates the menu item (handled by consumer event listeners)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .context-menu-item to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (context-menu-item.html)
- [ ] Implement HTML headless test (context-menu-item.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
