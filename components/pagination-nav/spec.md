# Pagination Nav — Specification

Single source of truth for spec-driven development of the Pagination Nav component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Pagination Nav component: an ordered list of page navigation links.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .pagination-nav

## Dependencies

- Requires children: pagination-list, pagination-list-item

## Approach

1. Use semantic <nav> element with class="pagination-nav"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="pagination-nav"
- [ ] `<nav aria-label="...">` -- creates a navigation landmark with a descriptive label for the pagination region
- [ ] Consumer applies `aria-current="page"` on the link representing the current page
- [ ] Keyboard: Tab: Moves focus between pagination links within the navigation
- [ ] Keyboard: Enter: Activates the focused link to navigate to that page
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .pagination-nav to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (pagination-nav.html)
- [ ] Implement HTML headless test (pagination-nav.test.js)
- [ ] Implement child component: pagination-list
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
