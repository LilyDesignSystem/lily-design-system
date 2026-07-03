# Breadcrumb List — Specification

Single source of truth for spec-driven development of the Breadcrumb List component. Consolidates the prior `plan.md` and `tasks.md`.

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

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .breadcrumb-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (breadcrumb-list.html)
- [ ] Implement HTML headless test (breadcrumb-list.test.js)
- [ ] Implement child component: breadcrumb-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
