# ContentsLink — Specification

Single source of truth for spec-driven development of the ContentsLink component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ContentsLink component: one table of contents link.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .contents-link

## Approach

1. Use semantic <a> element with class="contents-link"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="contents-link"
- [ ] `aria-current="true"` when the link corresponds to the currently visible section
- [ ] Keyboard: Tab: Focus the link
- [ ] Keyboard: Enter: Follow the link
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .contents-link to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (contents-link.html)
- [ ] Implement HTML headless test (contents-link.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
