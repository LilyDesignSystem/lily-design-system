# Postal Code View — Specification

Single source of truth for spec-driven development of the Postal Code View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Postal Code View component: a read-only display of a postal or ZIP code.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .postal-code-view

## Companion Component

- postal-code-input (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="postal-code-view"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="postal-code-view"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .postal-code-view to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (postal-code-view.html)
- [ ] Implement HTML headless test (postal-code-view.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: postal-code-input
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
