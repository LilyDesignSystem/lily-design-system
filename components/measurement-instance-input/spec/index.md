# Measurement Instance Input — Specification

Single source of truth for spec-driven development of the Measurement Instance Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Measurement Instance Input component: an input for entering a measurement value and unit.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .measurement-instance-input

## Companion Component

- measurement-instance-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <input> element with class="measurement-instance-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="measurement-instance-input"
- [ ] `aria-label` -- set from the `label` prop to provide an accessible name
- [ ] Keyboard: Native `<input type="text">` keyboard behavior (typing, selection, clipboard)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .measurement-instance-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (measurement-instance-input.html)
- [ ] Implement HTML headless test (measurement-instance-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: measurement-instance-view
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
