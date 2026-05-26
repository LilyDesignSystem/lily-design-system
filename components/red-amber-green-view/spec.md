# Red Amber Green View — Specification

Single source of truth for spec-driven development of the Red Amber Green View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Red Amber Green View component: a read-only display of a red/amber/green status.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .red-amber-green-view

## Companion Component

- red-amber-green-picker (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="red-amber-green-view"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="red-amber-green-view"
- [ ] `aria-label={label}` -- provides the accessible name for the status display, allowing screen readers to announce the context of the value
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .red-amber-green-view to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (red-amber-green-view.html)
- [ ] Implement HTML headless test (red-amber-green-view.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: red-amber-green-picker
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
