# Calendar Table — Implementation Plan

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
