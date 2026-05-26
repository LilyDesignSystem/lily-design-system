# Kanban Table Body — Implementation Plan

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
