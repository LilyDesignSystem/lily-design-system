# Gantt Table — Specification

Single source of truth for spec-driven development of the Gantt Table component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Gantt Table component: a Gantt chart table interactive grid for planning schedule visualization <table>.

## HTML Tag and CSS Class

- HTML tag: <table>
- CSS class: .gantt-table

## Dependencies

- Requires children: gantt-table-thead, gantt-table-tbody, gantt-table-tfoot, gantt-table-th, gantt-table-tr, gantt-table-td

## Approach

1. Use semantic <table> element with class="gantt-table"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <table> with class="gantt-table"
- [ ] `role="grid"` -- identifies the table as an interactive grid widget
- [ ] `aria-label={label}` -- provides an accessible name describing the Gantt chart
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .gantt-table to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (gantt-table.html)
- [ ] Implement HTML headless test (gantt-table.test.js)
- [ ] Implement child component: gantt-table-head
- [ ] Implement child component: gantt-table-body
- [ ] Implement child component: gantt-table-foot
- [ ] Implement child component: gantt-table-th
- [ ] Implement child component: gantt-table-row
- [ ] Implement child component: gantt-table-td

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
