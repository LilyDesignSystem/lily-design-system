# Loading — Specification

Single source of truth for spec-driven development of the Loading component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Loading component: a loading indicator, such as text, or image, or animation.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .loading

## Approach

1. Use semantic <div> element with class="loading"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="loading"
- [ ] `role="status"` -- creates an ARIA live region for loading announcements
- [ ] `aria-live="polite"` -- announces changes without interrupting
- [ ] `aria-label` -- describes the loading state
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .loading to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (loading.html)
- [ ] Implement HTML headless test (loading.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
