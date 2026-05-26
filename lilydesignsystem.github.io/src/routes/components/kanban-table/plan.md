# Kanban Table — Implementation Plan

## Goal

Implement the Kanban Table component: a kanban board table interactive grid for organizing items by status <table>.

## HTML Tag and CSS Class

- HTML tag: <table>
- CSS class: .kanban-table

## Dependencies

- Requires children: kanban-table-head, kanban-table-body, kanban-table-foot, kanban-table-th, kanban-table-row, kanban-table-td

## Approach

1. Use semantic <table> element with class="kanban-table"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <table> with class="kanban-table"
- [ ] `role="region"` -- defines the Kanban board as a named landmark section
- [ ] `aria-label={label}` -- provides an accessible name for the board region
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
