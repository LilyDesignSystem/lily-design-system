# Carousel — Specification

Single source of truth for spec-driven development of the Carousel component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Carousel component: a slideshow for cycling through content items.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .carousel

## Approach

1. Use semantic <div> element with class="carousel"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="carousel"
- [ ] `role="region"` -- identifies the carousel as a landmark region so screen readers can navigate to it.
- [ ] `aria-roledescription="carousel"` -- overrides the default "region" announcement with "carousel" for clearer context.
- [ ] `aria-label` -- provides an accessible name describing the carousel content.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .carousel to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (carousel.html)
- [ ] Implement HTML headless test (carousel.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
