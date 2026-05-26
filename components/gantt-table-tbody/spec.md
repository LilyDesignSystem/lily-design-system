# Gantt Table Body — Specification

Single source of truth for spec-driven development of the Gantt Table Body component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Gantt Table Body component: a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>.

## HTML Tag and CSS Class

- HTML tag: <tbody>
- CSS class: .gantt-table-tbody

## Dependencies

- Requires parent: gantt-table

## Approach

1. Use semantic <tbody> element with class="gantt-table-tbody"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tbody> with class="gantt-table-tbody"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .gantt-table-tbody to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (gantt-table-tbody.html)
- [ ] Implement HTML headless test (gantt-table-tbody.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
