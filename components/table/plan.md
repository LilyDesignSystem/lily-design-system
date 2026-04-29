# Table — Implementation Plan

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
