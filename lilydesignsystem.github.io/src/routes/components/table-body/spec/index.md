# Table Body — Specification

Single source of truth for spec-driven development of the Table Body component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Table Body component: a table interactive grid tbody <tbody>.

## HTML Tag and CSS Class

- HTML tag: <tbody>
- CSS class: .table-body

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <tbody> element with class="table-body"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tbody> with class="table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .table-body to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (table-body.html)
- [ ] Implement HTML headless test (table-body.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
