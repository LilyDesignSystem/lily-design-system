# Gantt Table Foot — Specification

Single source of truth for spec-driven development of the Gantt Table Foot component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Gantt Table Foot component: a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>.

## HTML Tag and CSS Class

- HTML tag: <tfoot>
- CSS class: .gantt-table-tfoot

## Dependencies

- Requires parent: gantt-table

## Approach

1. Use semantic <tfoot> element with class="gantt-table-tfoot"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tfoot> with class="gantt-table-tfoot"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .gantt-table-tfoot to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (gantt-table-tfoot.html)
- [ ] Implement HTML headless test (gantt-table-tfoot.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
