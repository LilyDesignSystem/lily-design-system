# Kanban Table Data — Implementation Plan

## Goal

Implement the Kanban Table Data component: kanban board table interactive grid data cell for organizing items by status <td>.

## HTML Tag and CSS Class

- HTML tag: <td>
- CSS class: .kanban-table-td

## Dependencies

- Requires parent: kanban-table

## Approach

1. Use semantic <td> element with class="kanban-table-td"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <td> with class="kanban-table-td"
- [ ] `role="listitem"` -- identifies this as an item within a list container (the parent Kanban column with `role="list"`)
- [ ] `aria-label` -- optional accessible name for the card, set from the `label` prop, allowing screen readers to identify individual cards
- [ ] Keyboard: None directly -- keyboard interaction depends on interactive elements within the card content provided by the consumer
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
