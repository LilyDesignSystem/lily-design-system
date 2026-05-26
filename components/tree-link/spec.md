# Tree Link — Specification

Single source of truth for spec-driven development of the Tree Link component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tree Link component: one tree link in the trail.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .tree-link

## Dependencies

- Requires parent: tree-list-item

## Approach

1. Use semantic <a> element with class="tree-link"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="tree-link"
- [ ] `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop
- [ ] Keyboard: Tab: Focus the link
- [ ] Keyboard: Enter: Activate the link (browser default)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tree-link to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tree-link.html)
- [ ] Implement HTML headless test (tree-link.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
