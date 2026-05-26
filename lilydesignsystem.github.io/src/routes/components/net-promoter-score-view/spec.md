# Net Promoter Score View — Specification

Single source of truth for spec-driven development of the Net Promoter Score View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Net Promoter Score View component: a read-only display of a Net Promoter Score.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .net-promoter-score-view

## Companion Component

- net-promoter-score-picker (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="net-promoter-score-view"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="net-promoter-score-view"
- [ ] `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the context of the displayed score
- [ ] Keyboard: None -- this is a passive informational display, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .net-promoter-score-view to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (net-promoter-score-view.html)
- [ ] Implement HTML headless test (net-promoter-score-view.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: net-promoter-score-picker
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
