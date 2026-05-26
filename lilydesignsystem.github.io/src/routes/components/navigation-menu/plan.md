# Navigation Menu — Implementation Plan

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
