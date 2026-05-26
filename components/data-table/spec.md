# Data Table — Specification

Single source of truth for spec-driven development of the Data Table component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Data Table component: a data table interactive grid for displaying and sorting tabular data <table>.

## HTML Tag and CSS Class

- HTML tag: <table>
- CSS class: .data-table

## Dependencies

- Requires children: data-table-head, data-table-body, data-table-foot, data-table-th, data-table-row, data-table-td

## Approach

1. Use semantic <table> element with class="data-table"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <table> with class="data-table"
- [ ] `aria-label={label}` -- provides an accessible name when no visible caption is present
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .data-table to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (data-table.html)
- [ ] Implement HTML headless test (data-table.test.js)
- [ ] Implement child component: data-table-head
- [ ] Implement child component: data-table-body
- [ ] Implement child component: data-table-foot
- [ ] Implement child component: data-table-th
- [ ] Implement child component: data-table-row
- [ ] Implement child component: data-table-td

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
