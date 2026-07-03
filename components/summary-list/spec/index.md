# Summary List — Specification

Single source of truth for spec-driven development of the Summary List component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Summary List component: an ordered list of key-value summary pairs.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .summary-list

## Dependencies

- Requires children: summary-list-item

## Approach

1. Use semantic <ol> element with class="summary-list"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="summary-list"
- [ ] `aria-label={label}` -- provides the accessible name for the description list, allowing screen readers to announce the context of the key-value pairs
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .summary-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (summary-list.html)
- [ ] Implement HTML headless test (summary-list.test.js)
- [ ] Implement child component: summary-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
