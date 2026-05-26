# Care Card — Specification

Single source of truth for spec-driven development of the Care Card component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Care Card component: a medical care instruction card with urgency levels.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .care-card

## Approach

1. Use semantic <div> element with class="care-card"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="care-card"
- [ ] `role="region"` -- identifies the card as a named landmark
- [ ] `aria-label` -- set from `label` prop or `heading` prop for screen reader identification
- [ ] Keyboard: None -- this component is a passive content container
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .care-card to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (care-card.html)
- [ ] Implement HTML headless test (care-card.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
