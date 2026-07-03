# Breadcrumb List Item — Specification

Single source of truth for spec-driven development of the Breadcrumb List Item component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Breadcrumb List Item component: one breadcrumb navigation link in the trail.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .breadcrumb-list-item

## Dependencies

- Requires parent: breadcrumb-list

## Approach

1. Use semantic <li> element with class="breadcrumb-list-item"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="breadcrumb-list-item"
- [ ] `aria-current="page"` -- set when `current` is true, indicating the user's current location in the breadcrumb trail
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .breadcrumb-list-item to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (breadcrumb-list-item.html)
- [ ] Implement HTML headless test (breadcrumb-list-item.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
