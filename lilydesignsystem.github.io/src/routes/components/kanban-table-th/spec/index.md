# Kanban Table Col — Specification

Single source of truth for spec-driven development of the Kanban Table Col component. Consolidates the prior `plan.md` and `tasks.md`.

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

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .kanban-table-th to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (kanban-table-th.html)
- [ ] Implement HTML headless test (kanban-table-th.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
