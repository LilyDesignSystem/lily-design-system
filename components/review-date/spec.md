# Review Date — Specification

Single source of truth for spec-driven development of the Review Date component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Review Date component: a display of a content review date.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .review-date

## Approach

1. Use semantic <span> element with class="review-date"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="review-date"
- [ ] `aria-label` -- provides screen reader context from the `label` prop
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .review-date to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (review-date.html)
- [ ] Implement HTML headless test (review-date.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
