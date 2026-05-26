# Error Summary — Specification

Single source of truth for spec-driven development of the Error Summary component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Error Summary component: a summary of all validation errors on a form.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .error-summary

## Approach

1. Use semantic <div> element with class="error-summary"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="error-summary"
- [ ] `role="alert"` -- creates a live region that announces content to screen readers when the summary appears
- [ ] `aria-labelledby={titleId}` -- associates the alert region with its heading for context
- [ ] Keyboard: **Tab**: Moves focus through the error links within the summary
- [ ] Keyboard: The container itself can receive programmatic focus via `element.focus()` due to `tabindex="-1"`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .error-summary to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (error-summary.html)
- [ ] Implement HTML headless test (error-summary.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
