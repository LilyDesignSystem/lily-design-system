# Kanban Table Col — Implementation Plan

## Goal

Implement the Kanban Table Col component: a kanban board table interactive grid column for organizing items by status <th>.

## HTML Tag and CSS Class

- HTML tag: <th>
- CSS class: .kanban-table-th

## Dependencies

- Requires parent: kanban-table

## Approach

1. Use semantic <th> element with class="kanban-table-th"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <th> with class="kanban-table-th"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
