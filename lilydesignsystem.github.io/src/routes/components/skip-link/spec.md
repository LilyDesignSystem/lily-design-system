# Skip Link — Specification

Single source of truth for spec-driven development of the Skip Link component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Skip Link component: a hidden link for keyboard users to skip to main content.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .skip-link

## Approach

1. Use semantic <a> element with class="skip-link"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="skip-link"
- [ ] Keyboard: Tab: Moves focus to the skip link (should be the first focusable element on the page)
- [ ] Keyboard: Enter: Activates the link, moving focus to the target anchor element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .skip-link to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (skip-link.html)
- [ ] Implement HTML headless test (skip-link.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
