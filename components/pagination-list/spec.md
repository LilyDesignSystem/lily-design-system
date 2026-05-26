# Pagination List — Specification

Single source of truth for spec-driven development of the Pagination List component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Pagination List component: an ordered list of page navigation links.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .pagination-list

## Dependencies

- Requires parent: pagination-nav
- Requires children: pagination-list-item

## Approach

1. Use semantic <ol> element with class="pagination-list"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="pagination-list"
- [ ] `<nav aria-label="...">` -- identifies the pagination as a navigation landmark with a descriptive label
- [ ] `aria-current="page"` -- consumer applies this to the link representing the current page
- [ ] Keyboard: Tab: Moves focus between pagination links/buttons in the list
- [ ] Keyboard: Enter: Activates the focused link or button to navigate to that page
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .pagination-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (pagination-list.html)
- [ ] Implement HTML headless test (pagination-list.test.js)
- [ ] Implement child component: pagination-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
