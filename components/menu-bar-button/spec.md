# Menu Bar Button — Specification

Single source of truth for spec-driven development of the Menu Bar Button component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Menu Bar Button component: one item in a menu bar.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .menu-bar-button

## Dependencies

- Requires parent: menu-bar

## Approach

1. Use semantic <button> element with class="menu-bar-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="menu-bar-button"
- [ ] `role="menuitem"` -- identifies this as an item within a menubar
- [ ] Keyboard: Arrow keys: Focus movement is managed by the parent MenuBar
- [ ] Keyboard: Enter / Space: Activate the menu item (consumer-provided handler)
- [ ] Keyboard: `tabindex="-1"` enables programmatic focus from parent keyboard navigation
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .menu-bar-button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (menu-bar-button.html)
- [ ] Implement HTML headless test (menu-bar-button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
