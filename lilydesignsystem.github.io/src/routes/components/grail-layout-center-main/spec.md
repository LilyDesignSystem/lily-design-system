# Grail Layout Center Main — Specification

Single source of truth for spec-driven development of the Grail Layout Center Main component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Grail Layout Center Main component: grail layout center main content with <main> tag.

## HTML Tag and CSS Class

- HTML tag: <main>
- CSS class: .grail-layout-center-main

## Dependencies

- Requires parent: grail-layout

## Approach

1. Use semantic <main> element with class="grail-layout-center-main"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <main> with class="grail-layout-center-main"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .grail-layout-center-main to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (grail-layout-center-main.html)
- [ ] Implement HTML headless test (grail-layout-center-main.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
