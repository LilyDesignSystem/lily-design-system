# Skeleton — Specification

Single source of truth for spec-driven development of the Skeleton component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Skeleton component: a placeholder loading animation for content.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .skeleton

## Approach

1. Use semantic <div> element with class="skeleton"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="skeleton"
- [ ] `aria-hidden="true"` -- hides the placeholder entirely from screen readers
- [ ] `aria-busy="true"` -- signals that this region is in a loading state and content will be replaced
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .skeleton to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (skeleton.html)
- [ ] Implement HTML headless test (skeleton.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
