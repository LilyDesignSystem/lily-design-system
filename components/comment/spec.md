# Comment — Specification

Single source of truth for spec-driven development of the Comment component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Comment component: a comment displays user discussions and user feedback.

## HTML Tag and CSS Class

- HTML tag: <article>
- CSS class: .comment

## Approach

1. Use semantic <article> element with class="comment"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <article> with class="comment"
- [ ] `aria-label` -- describes the comment for screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .comment to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (comment.html)
- [ ] Implement HTML headless test (comment.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
