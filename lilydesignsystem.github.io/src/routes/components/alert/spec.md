# Alert — Specification

Single source of truth for spec-driven development of the Alert component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Alert component: a status message for important information or feedback.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .alert

## Approach

1. Use semantic <div> element with class="alert"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="alert"
- [ ] `role="alert"` or `role="status"` for live region semantics
- [ ] `aria-live="assertive"` (default for alert role) or `aria-live="polite"` (default for status role)
- [ ] `aria-atomic="true"` ensures the entire region is re-announced on any change
- [ ] Keyboard: None -- alerts are passive announcements, not interactive elements
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .alert to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (alert.html)
- [ ] Implement HTML headless test (alert.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
