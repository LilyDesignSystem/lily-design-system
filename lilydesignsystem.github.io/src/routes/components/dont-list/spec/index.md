# Don't List — Specification

Single source of truth for spec-driven development of the Don't List component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Don't List component: a guideline list of discouraged dont-list-item components.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .dont-list

## Dependencies

- Requires children: dont-list-item

## Approach

1. Use semantic <ol> element with class="dont-list"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="dont-list"
- [ ] `role="list"` -- explicitly declares list semantics on the `<ul>`, ensuring assistive technology announces it as a list
- [ ] `aria-label={label}` -- provides an accessible name for the list (defaults to "Don't")
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .dont-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (dont-list.html)
- [ ] Implement HTML headless test (dont-list.test.js)
- [ ] Implement child component: dont-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
