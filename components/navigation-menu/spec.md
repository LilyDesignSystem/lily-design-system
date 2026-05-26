# Navigation Menu — Specification

Single source of truth for spec-driven development of the Navigation Menu component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Navigation Menu component: a site-wide navigation menu with links.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .navigation-menu

## Approach

1. Use semantic <nav> element with class="navigation-menu"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="navigation-menu"
- [ ] The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- [ ] `aria-label` -- provides an accessible name to distinguish this navigation from other `<nav>` landmarks on the page.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .navigation-menu to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (navigation-menu.html)
- [ ] Implement HTML headless test (navigation-menu.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
