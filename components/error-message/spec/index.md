# Error Message — Specification

Single source of truth for spec-driven development of the Error Message component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Error Message component: an error message associated with a form field.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .error-message

## Approach

1. Use semantic <span> element with class="error-message"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="error-message"
- [ ] `role="alert"` -- creates an assertive live region so the error message is announced immediately by screen readers when it appears
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .error-message to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (error-message.html)
- [ ] Implement HTML headless test (error-message.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
