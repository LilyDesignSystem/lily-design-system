# Tree Nav — Implementation Plan

## Goal

Implement the Tree Nav component: a hierarchical navigation with expandable branches.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .tree-nav

## Dependencies

- Requires children: tree-list, tree-list-item

## Approach

1. Use semantic <nav> element with class="tree-nav"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="tree-nav"
- [ ] `<nav aria-label="...">` -- creates a navigation landmark with a descriptive label for the tree navigation region
- [ ] Tree semantics (`role="tree"`, `role="treeitem"`) are provided by the child TreeList and TreeListItem components
- [ ] Keyboard: ArrowDown: Moves focus to the next visible tree item (managed by TreeList)
- [ ] Keyboard: ArrowUp: Moves focus to the previous visible tree item (managed by TreeList)
- [ ] Keyboard: ArrowRight: Expands a collapsed item, or moves to first child
- [ ] Keyboard: ArrowLeft: Collapses an expanded item, or moves to parent
- [ ] Keyboard: Home: Moves focus to the first tree item
- [ ] Keyboard: End: Moves focus to the last visible tree item
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
