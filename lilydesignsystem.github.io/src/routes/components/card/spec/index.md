# Card — Specification

Single source of truth for spec-driven development of the Card component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Card component: a grouped content container with header, body, and footer areas.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .card

## Approach

1. Use semantic <div> element with class="card"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="card"
- [ ] Optional `aria-label` -- identifies the card as a named landmark for screen readers
- [ ] Keyboard: Tab: Focus the heading link when `href` is provided
- [ ] Keyboard: Enter: Activate the heading link (browser default)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .card to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (card.html)
- [ ] Implement HTML headless test (card.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
