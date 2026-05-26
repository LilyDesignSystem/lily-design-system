# Place — Specification

Single source of truth for spec-driven development of the Place component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Place component: a place component that contains other place-related information.

## HTML Tag and CSS Class

- HTML tag: <article>
- CSS class: .place

## Approach

1. Use semantic <article> element with class="place"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <article> with class="place"
- [ ] `aria-label` -- describes the place for screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .place to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (place.html)
- [ ] Implement HTML headless test (place.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
