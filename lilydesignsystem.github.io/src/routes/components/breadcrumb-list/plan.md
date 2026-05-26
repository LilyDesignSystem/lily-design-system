# Breadcrumb List — Implementation Plan

## Goal

Implement the Breadcrumb List component: an ordered list of breadcrumb navigation items.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .breadcrumb-list

## Dependencies

- Requires parent: breadcrumb-nav
- Requires children: breadcrumb-list-item

## Approach

1. Use semantic <ol> element with class="breadcrumb-list"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="breadcrumb-list"
- [ ] The parent BreadcrumbNav provides the `<nav>` landmark with `aria-label`
- [ ] Keyboard: Tab: Focus moves between links in the breadcrumb trail
- [ ] Keyboard: Enter: Activates the focused breadcrumb link
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
