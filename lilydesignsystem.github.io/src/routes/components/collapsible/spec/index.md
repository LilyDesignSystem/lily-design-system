# Collapsible — Specification

Single source of truth for spec-driven development of the Collapsible component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Collapsible component: a container that can be expanded or collapsed.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .collapsible

## Approach

1. Use semantic <div> element with class="collapsible"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="collapsible"
- [ ] Keyboard: Enter/Space: Toggle the disclosure open/closed (handled natively by `<summary>`)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .collapsible to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (collapsible.html)
- [ ] Implement HTML headless test (collapsible.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
