# Tree Menu — Specification

Single source of truth for spec-driven development of the Tree Menu component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tree Menu component: a hierarchical tree menu with expandable branches.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tree-menu

## Approach

1. Use semantic <div> element with class="tree-menu"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tree-menu"
- [ ] `role="tree"` -- identifies the container as a tree view widget
- [ ] `aria-label={label}` -- provides an accessible name for the tree
- [ ] Consumer items should use `role="treeitem"` on each navigable child
- [ ] Keyboard: Arrow Down: Move focus to the next tree item (wraps to first)
- [ ] Keyboard: Arrow Up: Move focus to the previous tree item (wraps to last)
- [ ] Keyboard: Home: Move focus to the first tree item
- [ ] Keyboard: End: Move focus to the last tree item
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tree-menu to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tree-menu.html)
- [ ] Implement HTML headless test (tree-menu.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
