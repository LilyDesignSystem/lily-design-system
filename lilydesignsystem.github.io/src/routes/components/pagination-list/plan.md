# Pagination List — Implementation Plan

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
