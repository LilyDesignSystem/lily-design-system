# Date Range — Specification

Single source of truth for spec-driven development of the Date Range component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Date Range component: a display of a start and end date range.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .date-range

## Approach

1. Use semantic <span> element with class="date-range"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="date-range"
- [ ] `aria-label={label}` on `<fieldset>` -- provides an accessible group name for the date range pair
- [ ] `aria-label={startLabel}` on the start input -- identifies the start date field
- [ ] `aria-label={endLabel}` on the end input -- identifies the end date field
- [ ] Keyboard: Tab: Move focus between the start and end date inputs
- [ ] Keyboard: Up Arrow / Down Arrow: Increment/decrement the focused date segment
- [ ] Keyboard: Left Arrow / Right Arrow: Move between date segments within an input
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .date-range to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (date-range.html)
- [ ] Implement HTML headless test (date-range.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
