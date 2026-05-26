# Measurement Unit View — Specification

Single source of truth for spec-driven development of the Measurement Unit View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Measurement Unit View component: a read-only display of a measurement unit.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .measurement-unit-view

## Companion Component

- measurement-unit-input (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="measurement-unit-view"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="measurement-unit-view"
- [ ] `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed unit abbreviation
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .measurement-unit-view to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (measurement-unit-view.html)
- [ ] Implement HTML headless test (measurement-unit-view.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: measurement-unit-input
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
