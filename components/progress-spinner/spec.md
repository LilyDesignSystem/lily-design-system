# Progress Spinner — Specification

Single source of truth for spec-driven development of the Progress Spinner component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Progress Spinner component: an indeterminate spinning progress indicator.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .progress-spinner

## Approach

1. Use semantic <div> element with class="progress-spinner"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="progress-spinner"
- [ ] `role="status"` -- identifies the element as a status region that receives non-urgent updates
- [ ] `aria-label="..."` -- provides an accessible name describing what is loading
- [ ] `aria-live="polite"` -- ensures content changes are announced by screen readers at the next opportunity without interrupting
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .progress-spinner to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (progress-spinner.html)
- [ ] Implement HTML headless test (progress-spinner.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
