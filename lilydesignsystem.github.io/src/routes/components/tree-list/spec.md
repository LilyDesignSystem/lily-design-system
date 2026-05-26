# Tree List — Specification

Single source of truth for spec-driven development of the Tree List component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tree List component: a hierarchical list with nested expandable items.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .tree-list

## Dependencies

- Requires parent: tree-nav
- Requires children: tree-list-item

## Approach

1. Use semantic <ol> element with class="tree-list"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="tree-list"
- [ ] `role="tree"` -- identifies the container as a tree widget for hierarchical data
- [ ] `aria-label={label}` -- provides an accessible name describing the purpose of the tree
- [ ] Keyboard: ArrowDown: Moves focus to the next tree item; wraps to the first item after the last
- [ ] Keyboard: ArrowUp: Moves focus to the previous tree item; wraps to the last item before the first
- [ ] Keyboard: Home: Moves focus to the first tree item
- [ ] Keyboard: End: Moves focus to the last tree item
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tree-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tree-list.html)
- [ ] Implement HTML headless test (tree-list.test.js)
- [ ] Implement child component: tree-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
