# Table — Specification

Single source of truth for spec-driven development of the Table component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Table component: a table with rows and columns <table>.

## HTML Tag and CSS Class

- HTML tag: <table>
- CSS class: .table

## Dependencies

- Requires children: table-head, table-body, table-foot, table-th, table-row, table-td

## Approach

1. Use semantic <table> element with class="table"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <table> with class="table"
- [ ] `aria-label` -- provides the accessible name for the table so screen readers can announce its purpose
- [ ] Keyboard: None directly -- standard table navigation is handled by screen readers and browser built-in behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .table to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (table.html)
- [ ] Implement HTML headless test (table.test.js)
- [ ] Implement child component: table-head
- [ ] Implement child component: table-body
- [ ] Implement child component: table-foot
- [ ] Implement child component: table-th
- [ ] Implement child component: table-row
- [ ] Implement child component: table-td

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
