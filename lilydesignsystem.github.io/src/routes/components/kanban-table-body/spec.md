# Kanban Table Body — Specification

Single source of truth for spec-driven development of the Kanban Table Body component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Kanban Table Body component: a kanban board table interactive grid tbody for organizing items by status <tbody>.

## HTML Tag and CSS Class

- HTML tag: <tbody>
- CSS class: .kanban-table-body

## Dependencies

- Requires parent: kanban-table

## Approach

1. Use semantic <tbody> element with class="kanban-table-body"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tbody> with class="kanban-table-body"
- [ ] Column containers within should use `role="list"` with `aria-label` to identify each workflow stage
- [ ] Card items within columns should use `role="listitem"` (provided by KanbanTableTD)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .kanban-table-body to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (kanban-table-body.html)
- [ ] Implement HTML headless test (kanban-table-body.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
