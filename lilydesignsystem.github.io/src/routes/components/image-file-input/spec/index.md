# Image File Input — Specification

Single source of truth for spec-driven development of the Image File Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Image File Input component: an input for selecting image files with preview.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .image-file-input

## Approach

1. Use semantic <input> element with class="image-file-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="image-file-input"
- [ ] `aria-label` -- provides an accessible name for the file input when no visible label is present.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .image-file-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (image-file-input.html)
- [ ] Implement HTML headless test (image-file-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
