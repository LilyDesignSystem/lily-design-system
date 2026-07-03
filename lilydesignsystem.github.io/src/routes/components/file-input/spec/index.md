# File Input — Specification

Single source of truth for spec-driven development of the File Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the File Input component: an input for selecting files from the file system <input type="file">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .file-input

## Approach

1. Use semantic <input> element with class="file-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="file-input"
- [ ] `aria-label={label}` -- provides an accessible name for the file input since no visible `<label>` element is included
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .file-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (file-input.html)
- [ ] Implement HTML headless test (file-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
