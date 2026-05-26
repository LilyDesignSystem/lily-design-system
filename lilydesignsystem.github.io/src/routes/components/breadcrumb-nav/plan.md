# Breadcrumb Nav — Implementation Plan

## Goal

Implement the Breadcrumb Nav component: a navigation container for breadcrumb trail links.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .breadcrumb-nav

## Dependencies

- Requires children: breadcrumb-list, breadcrumb-list-item

## Approach

1. Use semantic <nav> element with class="breadcrumb-nav"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="breadcrumb-nav"
- [ ] `<nav>` with `aria-label` creates a navigation landmark for the breadcrumb trail
- [ ] `aria-current="page"` on the BreadcrumbListItem for the current page
- [ ] Keyboard: Tab: Focus moves between links in the breadcrumb trail
- [ ] Keyboard: Enter: Activates the focused breadcrumb link
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
