# Calendar Table — Specification

Single source of truth for spec-driven development of the Calendar Table component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Calendar Table component: a calendar table interactive grid for managing dates, days, etc. <table>.

## HTML Tag and CSS Class

- HTML tag: <table>
- CSS class: .calendar-table

## Dependencies

- Requires children: calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-th, calendar-table-row, calendar-table-td

## Approach

1. Use semantic <table> element with class="calendar-table"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <table> with class="calendar-table"
- [ ] `role="grid"` -- identifies the table as an interactive grid widget
- [ ] `aria-label={label}` -- provides an accessible name describing the calendar period
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .calendar-table to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (calendar-table.html)
- [ ] Implement HTML headless test (calendar-table.test.js)
- [ ] Implement child component: calendar-table-head
- [ ] Implement child component: calendar-table-body
- [ ] Implement child component: calendar-table-foot
- [ ] Implement child component: calendar-table-th
- [ ] Implement child component: calendar-table-row
- [ ] Implement child component: calendar-table-td

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
