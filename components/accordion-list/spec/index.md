# accordion list — Specification

Single source of truth for spec-driven development of the accordion list component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the accordion list component: an ordered list of accordion list item components.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .accordion-list

## Dependencies

- Requires parent: accordion-nav
- Requires children: accordion-list-item

## Approach

1. Use semantic <ol> element with class="accordion-list"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="accordion-list"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .accordion-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (accordion-list.html)
- [ ] Implement HTML headless test (accordion-list.test.js)
- [ ] Implement child component: accordion-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
