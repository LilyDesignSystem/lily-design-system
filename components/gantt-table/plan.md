# Gantt Table — Implementation Plan

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
