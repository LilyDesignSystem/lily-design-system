# Pagination Nav — Implementation Plan

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
