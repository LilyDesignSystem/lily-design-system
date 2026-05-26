# Pagination List Item — Implementation Plan

## Goal

Implement the Pagination List Item component: one page link in a pagination list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .pagination-list-item

## Dependencies

- Requires parent: pagination-list

## Approach

1. Use semantic <li> element with class="pagination-list-item"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="pagination-list-item"
- [ ] Consumer should set `aria-current="page"` on the active page link within the item
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
