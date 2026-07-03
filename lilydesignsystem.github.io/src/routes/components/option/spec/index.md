# Option — Specification

Single source of truth for spec-driven development of the Option component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Option component: an option element within a select dropdown.

## HTML Tag and CSS Class

- HTML tag: <option>
- CSS class: .option

## Approach

1. Use semantic <option> element with class="option"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <option> with class="option"
- [ ] Keyboard: Native `<option>` keyboard behavior (managed by parent `<select>`)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .option to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (option.html)
- [ ] Implement HTML headless test (option.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
