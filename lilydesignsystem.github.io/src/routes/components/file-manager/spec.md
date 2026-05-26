# File Manager — Specification

Single source of truth for spec-driven development of the File Manager component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the File Manager component: a file browser for navigating and managing files.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .file-manager

## Approach

1. Use semantic <div> element with class="file-manager"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="file-manager"
- [ ] `role="region"` -- defines the file manager as a named landmark section
- [ ] `aria-label={label}` -- provides an accessible name for the region
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .file-manager to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (file-manager.html)
- [ ] Implement HTML headless test (file-manager.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
