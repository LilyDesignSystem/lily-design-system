# Tree List Item — Specification

Single source of truth for spec-driven development of the Tree List Item component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tree List Item component: one item in a tree navigation list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .tree-list-item

## Dependencies

- Requires parent: tree-list

## Approach

1. Use semantic <li> element with class="tree-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="tree-list-item"
- [ ] `role="treeitem"` -- identifies the element as an item in a tree widget
- [ ] `aria-expanded` -- indicates whether an expandable item is open (`true`) or closed (`false`); omit for leaf nodes
- [ ] `aria-selected` -- indicates whether the item is selected (optional)
- [ ] Keyboard: ArrowDown: Moves focus to the next visible tree item (managed by parent TreeList)
- [ ] Keyboard: ArrowUp: Moves focus to the previous visible tree item (managed by parent TreeList)
- [ ] Keyboard: ArrowRight: Expands a collapsed item, or moves to first child (when applicable)
- [ ] Keyboard: ArrowLeft: Collapses an expanded item, or moves to parent (when applicable)
- [ ] Keyboard: Home: Moves focus to the first tree item (managed by parent TreeList)
- [ ] Keyboard: End: Moves focus to the last visible tree item (managed by parent TreeList)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tree-list-item to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tree-list-item.html)
- [ ] Implement HTML headless test (tree-list-item.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
