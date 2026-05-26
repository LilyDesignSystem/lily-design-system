# Grail Layout — Specification

Single source of truth for spec-driven development of the Grail Layout component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Grail Layout component: a responsive web design structure with header, left aside, center main, right aside, footer.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .grail-layout

## Dependencies

- Requires children: grail-layout-top-header, grail-layout-left-aside, grail-layout-center-main, grail-layout-right-aside, grail-layout-bottom-footer

## Approach

1. Use semantic <div> element with class="grail-layout"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="grail-layout"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .grail-layout to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (grail-layout.html)
- [ ] Implement HTML headless test (grail-layout.test.js)
- [ ] Implement child component: grail-layout-top-header
- [ ] Implement child component: grail-layout-left-aside
- [ ] Implement child component: grail-layout-center-main
- [ ] Implement child component: grail-layout-right-aside
- [ ] Implement child component: grail-layout-bottom-footer

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
