# Calendar Table Row — Specification

Single source of truth for spec-driven development of the Calendar Table Row component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Calendar Table Row component: a calendar table interactive grid row for managing dates, days, etc. <tr>.

## HTML Tag and CSS Class

- HTML tag: <tr>
- CSS class: .calendar-table-row

## Dependencies

- Requires parent: calendar-table

## Approach

1. Use semantic <tr> element with class="calendar-table-row"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tr> with class="calendar-table-row"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .calendar-table-row to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (calendar-table-row.html)
- [ ] Implement HTML headless test (calendar-table-row.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
