# Kanban Table — Specification

Single source of truth for spec-driven development of the Kanban Table component. Consolidates the prior `plan.md` and `tasks.md`.

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

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .kanban-table to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (kanban-table.html)
- [ ] Implement HTML headless test (kanban-table.test.js)
- [ ] Implement child component: kanban-table-head
- [ ] Implement child component: kanban-table-body
- [ ] Implement child component: kanban-table-foot
- [ ] Implement child component: kanban-table-th
- [ ] Implement child component: kanban-table-row
- [ ] Implement child component: kanban-table-td

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
