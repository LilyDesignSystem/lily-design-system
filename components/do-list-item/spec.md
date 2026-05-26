# Do List Item — Specification

Single source of truth for spec-driven development of the Do List Item component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Do List Item component: an encouraged-practice item in a do-list guideline list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .do-list-item

## Dependencies

- Requires parent: do-list

## Approach

1. Use semantic <li> element with class="do-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="do-list-item"
- [ ] Keyboard: None directly -- standard list item with no interactive behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .do-list-item to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (do-list-item.html)
- [ ] Implement HTML headless test (do-list-item.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
