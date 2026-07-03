# Table Row — Specification

Single source of truth for spec-driven development of the Table Row component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Table Row component: a table interactive grid row <tr>.

## HTML Tag and CSS Class

- HTML tag: <tr>
- CSS class: .table-row

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <tr> element with class="table-row"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tr> with class="table-row"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .table-row to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (table-row.html)
- [ ] Implement HTML headless test (table-row.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
