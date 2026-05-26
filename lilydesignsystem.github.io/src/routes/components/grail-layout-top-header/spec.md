# Grail Layout Top Header — Specification

Single source of truth for spec-driven development of the Grail Layout Top Header component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Grail Layout Top Header component: grail layout top header full width with <header> tag.

## HTML Tag and CSS Class

- HTML tag: <header>
- CSS class: .grail-layout-top-header

## Dependencies

- Requires parent: grail-layout

## Approach

1. Use semantic <header> element with class="grail-layout-top-header"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <header> with class="grail-layout-top-header"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .grail-layout-top-header to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (grail-layout-top-header.html)
- [ ] Implement HTML headless test (grail-layout-top-header.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
