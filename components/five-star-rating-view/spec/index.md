# Five Star Rating View — Specification

Single source of truth for spec-driven development of the Five Star Rating View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Five Star Rating View component: a read-only display of a five-star rating.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .five-star-rating-view

## Companion Component

- five-star-rating-picker (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="five-star-rating-view"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="five-star-rating-view"
- [ ] `role="img"` -- indicates the span represents a visual/graphic element (the star rating)
- [ ] `aria-label="..."` -- provides the full rating description for screen readers
- [ ] `aria-hidden="true"` -- on each inner star span, prevents screen readers from reading individual star characters
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .five-star-rating-view to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (five-star-rating-view.html)
- [ ] Implement HTML headless test (five-star-rating-view.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: five-star-rating-picker
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
